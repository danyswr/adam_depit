// Google Apps Script untuk UKM Portfolio Platform
// COPY PASTE SEMUA KODE INI KE GOOGLE APPS SCRIPT ANDA
// LALU JALANKAN FUNCTION updateExistingUKMData() SEKALI SAJA UNTUK MEMPERBAIKI DATA

// Konstanta
const FOLDER_ID = "1ZoZ-i_aZUvNHVE_g3J0oNSrxZ02L23EP"; // Your Google Drive folder ID

// FUNGSI UNTUK MEMPERBAIKI UKM EXISTING - JALANKAN SEKALI
function updateExistingUKMData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ukmSheet = ss.getSheetByName("UKM");
    
    if (!ukmSheet) {
      console.log("UKM Sheet tidak ditemukan");
      return;
    }
    
    const ukms = ukmSheet.getDataRange().getValues();
    console.log(`Memperbaiki ${ukms.length - 1} UKM...`);
    
    // Update semua UKM existing yang id_users nya kosong
    for (let i = 1; i < ukms.length; i++) {
      const idUsers = ukms[i][4]; // id_users di kolom E (index 4)
      
      // Jika id_users kosong, set ke admin default
      if (!idUsers || idUsers === "") {
        ukmSheet.getRange(i + 1, 5).setValue("test@gmail.com"); // Set ke admin test
        console.log(`Row ${i + 1}: Updated id_users to test@gmail.com`);
      }
    }
    
    console.log("Perbaikan data UKM selesai!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

// FUNGSI UNTUK MEMPERBAIKI DATA PENDAFTARAN EXISTING - JALANKAN SEKALI
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
          imageUrl = uploadImageToDrive({ 
            imageData: data.imageData, 
            mimeType: data.mimeType, 
            fileName: data.fileName 
          });
        }
        
        const createdAt = new Date().toISOString();
        const row = [
          ukmId, 
          data.nama_ukm || "", 
          imageUrl, 
          data.deskripsi || "", 
          data.id_users || email, // Use email as id_users if not provided
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

function handleRegistrationCRUD(json) {
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

    switch (action) {
      case "register":
        if (!data || !data.id_ukm) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "UKM ID is required" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Check if already registered
        const existingReg = findRowIndex(sheet, email, 1, data.id_ukm, 2);
        if (existingReg !== -1) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Already registered to this UKM" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Get UKM name
        const ukmSheet = getSheet("UKM");
        const ukmData = ukmSheet.getDataRange().getValues();
        let ukmName = "";
        
        for (let i = 1; i < ukmData.length; i++) {
          if (ukmData[i][0] === data.id_ukm) {
            ukmName = ukmData[i][1];
            break;
          }
        }
        
        const registrationId = Utilities.getUuid();
        const createdAt = new Date().toISOString();
        const regRow = [registrationId, email, data.id_ukm, ukmName, createdAt];
        
        sheet.appendRow(regRow);
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          id_daftar: registrationId 
        })).setMimeType(ContentService.MimeType.JSON);
        
      case "read":
        const allRegistrations = sheet.getDataRange().getValues();
        if (allRegistrations.length <= 1) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: true, 
            data: [] 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          data: allRegistrations.slice(1)
        })).setMimeType(ContentService.MimeType.JSON);
        
      case "unregister":
        if (!data || !data.id_ukm) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "UKM ID is required" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const unregIndex = findRowIndex(sheet, email, 1, data.id_ukm, 2);
        if (unregIndex !== -1) {
          sheet.deleteRow(unregIndex + 2);
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
    console.error("Registration CRUD error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function findRowIndex(sheet, value, column, value2 = null, column2 = null) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][column] === value) {
      if (value2 !== null && column2 !== null) {
        if (data[i][column2] === value2) {
          return i - 1;
        }
      } else {
        return i - 1;
      }
    }
  }
  return -1;
}

// Main function to handle all requests
function doPost(e) {
  try {
    const json = JSON.parse(e.postData.contents);
    console.log("Received request:", json);
    
    if (json.sheet === "Users") {
      if (json.action === "register") {
        return registerUser(json);
      } else if (json.action === "login") {
        return loginUser(json);
      }
    } else if (json.sheet === "UKM") {
      return handleUKMCRUD(json);
    } else if (json.sheet === "Daftar") {
      return handleRegistrationCRUD(json);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Invalid request" 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error("Main error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function
function test() {
  console.log("Test function works!");
}