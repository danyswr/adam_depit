// ini kode.gs nya
// COPY PASTE SEMUA KODE INI KE GOOGLE APPS SCRIPT ANDA
// LALU JALANKAN FUNCTION fixExistingData() SEKALI SAJA

// Konstanta
const FOLDER_ID = "1ZoZ-i_aZUvNHVE_g3J0oNSrxZ02L23EP"; // Your Google Drive folder ID

// FUNGSI UNTUK MEMPERBAIKI DATA EXISTING - JALANKAN SEKALI
function fixExistingData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const daftarSheet = ss.getSheetByName("Daftar");
    const ukmSheet = ss.getSheetByName("UKM");
    
    if (!daftarSheet || !ukmSheet) {
      console.log("Sheet tidak ditemukan");
      return;
    }
    
    const daftar = daftarSheet.getDataRange().getValues();
    const ukms = ukmSheet.getDataRange().getValues();
    
    console.log(`Memperbaiki ${daftar.length - 1} pendaftaran...`);
    
    // Update semua pendaftaran existing
    for (let i = 1; i < daftar.length; i++) {
      const ukmId = daftar[i][2]; // id_ukm di kolom C
      
      // Cari nama UKM dari sheet UKM
      for (let j = 1; j < ukms.length; j++) {
        if (ukms[j][0] === ukmId) { // id_ukm match
          const namaUkm = ukms[j][1]; // nama_ukm dari UKM
          
          // Update nama_ukm di sheet Daftar
          daftarSheet.getRange(i + 1, 4).setValue(namaUkm);
          daftarSheet.getRange(i + 1, 5).setValue(new Date().toISOString());
          
          console.log(`Row ${i + 1}: Updated nama_ukm to ${namaUkm}`);
          break;
        }
      }
    }
    
    console.log("Perbaikan data selesai!");
    
  } catch (error) {
    console.error("Error:", error);
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
  return user ? user[8] : null;
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
          "user_id", "nama_mahasiswa", "password", "email_student", 
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

function registerUser(json) {
  try {
    const sheet = getSheet("Users");
    if (!sheet) throw new Error("Users sheet not found");

    const { email, password, namaMahasiswa, nomorWhatsapp, nim, gender, jurusan, role } = json;
    if (!email || !password || !namaMahasiswa || !role) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Missing required fields" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!isEmailUnique(email)) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email already exists" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (role !== "user" && role !== "admin") {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Role must be 'user' or 'admin'" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const hashedPassword = hashPassword(password);
    const userId = email;
    const createdAt = new Date().toISOString();
    const row = [
      userId, namaMahasiswa, hashedPassword, email, 
      nomorWhatsapp || "", nim || "", gender || "", jurusan || "", role
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
        role: role,
        createdAt: createdAt
      },
      redirect: role === "user" ? "/user" : "/admin" 
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Registration error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function loginUser(json) {
  try {
    const sheet = getSheet("Users");
    if (!sheet) throw new Error("Users sheet not found");

    const { email, password } = json;
    if (!email || !password) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email and password are required" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email not found" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const user = data.slice(1).find(row => row[3] === email);
    if (!user) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email not found" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const storedHash = user[2];
    const inputHash = hashPassword(password);
    if (storedHash !== inputHash) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Invalid password" 
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
        role: user[8],
        createdAt: user[8] ? new Date().toISOString() : ""
      },
      redirect: user[8] === "user" ? "/user" : "/admin" 
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Login error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleUKMCRUD(json) {
  try {
    const sheet = getSheet("UKM");
    if (!sheet) throw new Error("UKM sheet not found");

    const { email, action, data } = json;
    if (!email || !action) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Missing required fields" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const role = getUserRole(email);
    
    switch (action) {
      case "create":
        if (role !== "admin") {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Access denied. Only admins can create UKM entries" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        if (!data) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "UKM data is required" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const ukmId = Utilities.getUuid();
        let imageUrl = "";
        
        if (data.imageData) {
          console.log("Uploading image to Drive...");
          imageUrl = uploadImageToDrive({ 
            imageData: data.imageData, 
            mimeType: data.mimeType, 
            fileName: data.fileName 
          });
          console.log("Image uploaded, URL:", imageUrl);
          if (!imageUrl) {
            console.error("Failed to upload image - imageUrl is empty");
          }
        }
        
        // Get user ID from email
        const userId = getUserIdByEmail(email);
        
        const createdAt = new Date().toISOString();
        const row = [
          ukmId, 
          data.nama_ukm || "", 
          imageUrl, 
          data.deskripsi || "", 
          userId, // Set creator's user ID
          data.prestasi || ""
        ];
        
        sheet.appendRow(row);
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          id_ukm: ukmId 
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
            error: "Access denied. Only admins can update UKM entries" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const updateIndex = findRowIndex(sheet, json.id_ukm, 0);
        if (updateIndex !== -1) {
          const currentRow = sheet.getRange(updateIndex + 2, 1, 1, 6).getValues()[0];
          let newImageUrl = currentRow[2];
          
          if (data.imageData) {
            newImageUrl = uploadImageToDrive({ 
              imageData: data.imageData, 
              mimeType: data.mimeType, 
              fileName: data.fileName 
            });
          }
          
          const updatedRow = [
            json.id_ukm || currentRow[0],
            data.nama_ukm !== undefined ? data.nama_ukm : currentRow[1],
            newImageUrl,
            data.deskripsi !== undefined ? data.deskripsi : currentRow[3],
            data.id_users !== undefined ? data.id_users : currentRow[4],
            data.prestasi !== undefined ? data.prestasi : currentRow[5]
          ];
          
          sheet.getRange(updateIndex + 2, 1, 1, updatedRow.length).setValues([updatedRow]);
          return ContentService.createTextOutput(JSON.stringify({ 
            success: true 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "UKM not found" 
        })).setMimeType(ContentService.MimeType.JSON);
        
      case "delete":
        if (role !== "admin") {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Access denied. Only admins can delete UKM entries" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const delIndex = findRowIndex(sheet, json.id_ukm, 0);
        if (delIndex !== -1) {
          sheet.deleteRow(delIndex + 2);
          return ContentService.createTextOutput(JSON.stringify({ 
            success: true 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "UKM not found" 
        })).setMimeType(ContentService.MimeType.JSON);
        
      default:
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "Invalid action" 
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

function handleDaftarCRUD(json) {
  try {
    const sheet = getSheet("Daftar");
    if (!sheet) throw new Error("Daftar sheet not found");

    const { email, action, data } = json;
    if (!email || !action) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Missing required fields" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const role = getUserRole(email);
    
    switch (action) {
      case "create":
        if (role !== "user") {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Access denied. Only users can register for UKM" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        if (!data) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Registration data is required" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Dapatkan nama UKM dari sheet UKM
        const namaUkm = getNamaUkmById(data.id_ukm);
        if (!namaUkm) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "UKM not found" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const daftarId = Utilities.getUuid();
        const createdAt = new Date().toISOString();
        const row = [
          daftarId, 
          email, // id_user
          data.id_ukm || "", 
          namaUkm, 
          createdAt
        ];
        
        sheet.appendRow(row);
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          id_daftar: daftarId 
        })).setMimeType(ContentService.MimeType.JSON);
        
      case "read":
        const allDaftar = sheet.getDataRange().getValues();
        if (allDaftar.length <= 1) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: true, 
            data: [] 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          data: allDaftar.slice(1)
        })).setMimeType(ContentService.MimeType.JSON);

      case "delete":
        if (role !== "admin") {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Access denied. Only admins can delete registrations" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const delIndex = findRowIndex(sheet, json.id_daftar, 0);
        if (delIndex !== -1) {
          sheet.deleteRow(delIndex + 2);
          return ContentService.createTextOutput(JSON.stringify({ 
            success: true 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "Registration not found" 
        })).setMimeType(ContentService.MimeType.JSON);
        
      default:
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "Invalid action" 
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error("Daftar CRUD error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getNamaUkmById(ukmId) {
  const sheet = getSheet("UKM");
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return null;
  const ukm = data.slice(1).find(row => row[0] === ukmId);
  return ukm ? ukm[1] : null; // nama_ukm di kolom B
}

function getUserIdByEmail(email) {
  const sheet = getSheet("Users");
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return null;
  const user = data.slice(1).find(row => row[3] === email);
  return user ? user[0] : null; // userId di kolom A
}

function findRowIndex(sheet, value, column) {
  try {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][column] === value) {
        return i - 1;
      }
    }
    return -1;
  } catch (error) {
    console.error("Error finding row index:", error);
    return -1;
  }
}

function doPost(e) {
  try {
    // Debug: Log the incoming request
    console.log("doPost called");
    console.log("Request body:", e.postData);
    
    // Handle case where postData is undefined or null
    if (!e.postData || !e.postData.contents) {
      console.log("No postData or contents found");
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "No data received" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const json = JSON.parse(e.postData.contents);
    console.log("Parsed JSON:", json);
    
    const { sheet, action } = json;
    
    if (!sheet || !action) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Sheet and action are required" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    switch (sheet) {
      case "Users":
        if (action === "register") return registerUser(json);
        if (action === "login") return loginUser(json);
        break;
      case "UKM":
        return handleUKMCRUD(json);
      case "Daftar":
        return handleDaftarCRUD(json);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Invalid request" 
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("doPost error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function uploadImageToDrive(imageData) {
  try {
    if (!imageData.imageData || !imageData.mimeType || !imageData.fileName) {
      throw new Error("Missing image data, mime type, or file name");
    }
    
    // Convert base64 to blob
    const blob = Utilities.newBlob(
      Utilities.base64Decode(imageData.imageData), 
      imageData.mimeType, 
      imageData.fileName
    );
    
    // Get the target folder
    const folder = DriveApp.getFolderById(FOLDER_ID);
    
    // Upload file to Drive
    const file = folder.createFile(blob);
    
    // Make file publicly viewable
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Return the direct image URL for display with export parameter
    const fileId = file.getId();
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
    
  } catch (error) {
    console.error("Error uploading image to Drive:", error);
    return ""; // Return empty string if upload fails
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Web App is running. Use POST for operations.");
}