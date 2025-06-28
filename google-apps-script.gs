// COPY PASTE SEMUA KODE INI KE GOOGLE APPS SCRIPT ANDA
// PASTIKAN UNTUK MENGGANTI FOLDER_ID SESUAI DENGAN FOLDER GOOGLE DRIVE ANDA

// Konstanta
const FOLDER_ID = "1ZoZ-i_aZUvNHVE_g3J0oNSrxZ02L23EP"; // Your Google Drive folder ID

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    console.log('Received data:', data);
    
    const { action } = data;
    
    switch (action) {
      case 'register':
        return registerUser(data);
      case 'login':
        return loginUser(data);
      case 'ukm':
        return handleUKMCRUD(data);
      case 'register_ukm':
        return registerToUKM(data);
      case 'unregister_ukm':
        return unregisterFromUKM(data);
      case 'get_user_ukms':
        return getUserUKMs(data);
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Invalid action'
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error('doPost error:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message || 'Server error'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function hashPassword(password) {
  if (!password) throw new Error("Password is required");
  const hashed = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password, Utilities.Charset.UTF_8);
  return hashed.map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

function isEmailUnique(email) {
  const sheet = getSheet("Users");
  if (!sheet) throw new Error("Users sheet not found");
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return true;
  return !data.slice(1).some(row => row[3] === email);
}

function getUserRole(email) {
  const sheet = getSheet("Users");
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return null;
  const user = data.slice(1).find(row => row[3] === email);
  return user ? user[8] : 'user'; // Default to 'user' if role not found
}

function uploadImageToDrive(data) {
  try {
    if (!data.imageData || !data.mimeType || !data.fileName) {
      throw new Error("Image data is incomplete");
    }
    const blob = Utilities.newBlob(Utilities.base64Decode(data.imageData), data.mimeType, data.fileName);
    const file = DriveApp.getFolderById(FOLDER_ID).createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return "https://drive.google.com/uc?export=view&id=" + file.getId();
  } catch (error) {
    console.error("Error uploading image:", error);
    return "";
  }
}

function getSheet(name) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(name);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(name);
      
      if (name === "Users") {
        sheet.getRange(1, 1, 1, 9).setValues([[
          "user_id", "nama_mahasiswa", "password", "email", 
          "nomor_whatsapp", "NIM", "gender", "jurusan", "role"
        ]]);
      } else if (name === "UKM") {
        sheet.getRange(1, 1, 1, 6).setValues([[
          "id_ukm", "nama_ukm", "gambar_url", "deskripsi", "id_users", "prestasi"
        ]]);
      } else if (name === "Daftar") {
        sheet.getRange(1, 1, 1, 5).setValues([[
          "id_daftar", "id_user", "id_ukm", "nama_ukm", "created_at"
        ]]);
      }
    }
    
    return sheet;
  } catch (error) {
    console.error("Error getting sheet:", error);
    return null;
  }
}

function registerUser(data) {
  try {
    const sheet = getSheet("Users");
    if (!sheet) throw new Error("Users sheet not found");

    const { email, password, namaMahasiswa, nomorWhatsapp, nim, gender, jurusan, role } = data;
    if (!email || !password || !namaMahasiswa) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email, password, dan nama lengkap wajib diisi" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!isEmailUnique(email)) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email sudah terdaftar" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const hashedPassword = hashPassword(password);
    const userId = email;
    const userRole = role || (email.includes('admin') ? 'admin' : 'user');
    const row = [
      userId, namaMahasiswa, hashedPassword, email, 
      nomorWhatsapp || "", nim || "", gender || "", jurusan || "", userRole
    ];
    
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      data: {
        userId: email,
        namaMahasiswa: namaMahasiswa,
        email: email,
        nomorWhatsapp: nomorWhatsapp || "",
        nim: nim || "",
        gender: gender || "",
        jurusan: jurusan || "",
        role: userRole,
        createdAt: new Date().toISOString()
      },
      redirect: "/dashboard"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Registration error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function loginUser(data) {
  try {
    const sheet = getSheet("Users");
    if (!sheet) throw new Error("Users sheet not found");

    const { email, password } = data;
    if (!email || !password) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email dan password wajib diisi" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const sheetData = sheet.getDataRange().getValues();
    if (sheetData.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email tidak ditemukan" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const user = sheetData.slice(1).find(row => row[3] === email);
    if (!user) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email tidak ditemukan" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const storedHash = user[2];
    const inputHash = hashPassword(password);
    if (storedHash !== inputHash) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Password salah" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      data: {
        userId: user[0],
        namaMahasiswa: user[1],
        email: user[3],
        nomorWhatsapp: user[4],
        nim: user[5],
        gender: user[6],
        jurusan: user[7],
        role: user[8] || 'user',
        createdAt: new Date().toISOString()
      },
      redirect: "/dashboard"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Login error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleUKMCRUD(data) {
  try {
    const sheet = getSheet("UKM");
    if (!sheet) throw new Error("UKM sheet not found");

    const { email, method, ukmData } = data;
    if (!email) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email wajib diisi" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const role = getUserRole(email);
    
    switch (method) {
      case "create":
        if (role !== "admin") {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Akses ditolak. Hanya admin yang dapat membuat UKM" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        if (!ukmData) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Data UKM wajib diisi" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const ukmId = Utilities.getUuid();
        let imageUrl = "";
        
        if (ukmData.imageData) {
          imageUrl = uploadImageToDrive({ 
            imageData: ukmData.imageData, 
            mimeType: ukmData.mimeType, 
            fileName: ukmData.fileName 
          });
        }
        
        const row = [
          ukmId, 
          ukmData.nama_ukm || "", 
          imageUrl, 
          ukmData.deskripsi || "", 
          ukmData.id_users || "", 
          ukmData.prestasi || ""
        ];
        
        sheet.appendRow(row);
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          data: { id_ukm: ukmId }
        })).setMimeType(ContentService.MimeType.JSON);
        
      case "read":
        const allUKMs = sheet.getDataRange().getValues();
        if (allUKMs.length <= 1) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: true, 
            data: [] 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          data: allUKMs.slice(1)
        })).setMimeType(ContentService.MimeType.JSON);
        
      case "update":
        if (role !== "admin") {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Akses ditolak. Hanya admin yang dapat mengupdate UKM" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const updateIndex = findRowIndex(sheet, data.ukmId, 0);
        if (updateIndex !== -1) {
          const currentRow = sheet.getRange(updateIndex + 2, 1, 1, 6).getValues()[0];
          let newImageUrl = currentRow[2];
          
          if (ukmData.imageData) {
            newImageUrl = uploadImageToDrive({ 
              imageData: ukmData.imageData, 
              mimeType: ukmData.mimeType, 
              fileName: ukmData.fileName 
            });
          }
          
          const updatedRow = [
            data.ukmId || currentRow[0],
            ukmData.nama_ukm !== undefined ? ukmData.nama_ukm : currentRow[1],
            newImageUrl,
            ukmData.deskripsi !== undefined ? ukmData.deskripsi : currentRow[3],
            ukmData.id_users !== undefined ? ukmData.id_users : currentRow[4],
            ukmData.prestasi !== undefined ? ukmData.prestasi : currentRow[5]
          ];
          
          sheet.getRange(updateIndex + 2, 1, 1, updatedRow.length).setValues([updatedRow]);
          return ContentService.createTextOutput(JSON.stringify({ 
            success: true 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "UKM tidak ditemukan" 
        })).setMimeType(ContentService.MimeType.JSON);
        
      case "delete":
        if (role !== "admin") {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Akses ditolak. Hanya admin yang dapat menghapus UKM" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const delIndex = findRowIndex(sheet, data.ukmId, 0);
        if (delIndex !== -1) {
          sheet.deleteRow(delIndex + 2);
          return ContentService.createTextOutput(JSON.stringify({ 
            success: true 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "UKM tidak ditemukan" 
        })).setMimeType(ContentService.MimeType.JSON);
        
      default:
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "Method tidak valid" 
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error("UKM CRUD error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function registerToUKM(data) {
  try {
    const sheet = getSheet("Daftar");
    if (!sheet) throw new Error("Daftar sheet not found");
    
    const ukmSheet = getSheet("UKM");
    if (!ukmSheet) throw new Error("UKM sheet not found");

    const { email, ukmId } = data;
    if (!email || !ukmId) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email dan UKM ID wajib diisi" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Check if already registered
    const daftarData = sheet.getDataRange().getValues();
    const alreadyRegistered = daftarData.slice(1).some(row => 
      row[1] === email && row[2] === ukmId
    );
    
    if (alreadyRegistered) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Anda sudah terdaftar di UKM ini" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Get UKM name
    const ukmData = ukmSheet.getDataRange().getValues();
    const ukm = ukmData.slice(1).find(row => row[0] === ukmId);
    if (!ukm) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "UKM tidak ditemukan" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const daftarId = Utilities.getUuid();
    const row = [
      daftarId,
      email,
      ukmId,
      ukm[1], // nama_ukm
      new Date().toISOString()
    ];
    
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true,
      data: { message: "Berhasil mendaftar ke UKM" }
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Register to UKM error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function unregisterFromUKM(data) {
  try {
    const sheet = getSheet("Daftar");
    if (!sheet) throw new Error("Daftar sheet not found");

    const { email, ukmId } = data;
    if (!email || !ukmId) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email dan UKM ID wajib diisi" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const daftarData = sheet.getDataRange().getValues();
    for (let i = 1; i < daftarData.length; i++) {
      if (daftarData[i][1] === email && daftarData[i][2] === ukmId) {
        sheet.deleteRow(i + 1);
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true,
          data: { message: "Berhasil keluar dari UKM" }
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Pendaftaran tidak ditemukan" 
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Unregister from UKM error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getUserUKMs(data) {
  try {
    const daftarSheet = getSheet("Daftar");
    const ukmSheet = getSheet("UKM");
    if (!daftarSheet || !ukmSheet) throw new Error("Required sheets not found");

    const { email } = data;
    if (!email) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email wajib diisi" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const daftarData = daftarSheet.getDataRange().getValues();
    const ukmData = ukmSheet.getDataRange().getValues();
    
    const userUKMs = [];
    
    for (let i = 1; i < daftarData.length; i++) {
      if (daftarData[i][1] === email) {
        const ukmId = daftarData[i][2];
        const ukm = ukmData.slice(1).find(row => row[0] === ukmId);
        if (ukm) {
          userUKMs.push(ukm);
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      data: userUKMs
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Get user UKMs error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function findRowIndex(sheet, searchValue, columnIndex) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][columnIndex] === searchValue) {
      return i - 1; // Return 0-based index
    }
  }
  return -1;
}

// Helper function untuk testing
function testConnection() {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "Google Apps Script is working!",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}