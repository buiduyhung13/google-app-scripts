//https://docs.google.com/spreadsheets/d/1z68TimyhBsuLKgeo-O7RLocLviIUONEJg3wpfOS84pM/edit?usp=sharing
// Change config here to setup to your spreadsheet
const CONFIGS = {
  "testing": {
    inputColIndex:1,
    dateTimeColHeader: "TIME DATE"
  },
    "testing 2": {
    inputColIndex:1,
    dateTimeColHeader: "TIME DATE"
  }
}

const DATE_TIME_FORMAT = "yyyy-MM-dd hh:mm"


// Listen into onEdit event
function onEdit(e) {  
  var ss = SpreadsheetApp.getActiveSheet();
  handleAddDateTime(ss, e.range)
};

// Get dateTimeColumn index
function getDatetimeCol(sheetName, dateTimeHeader){
  var headers = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getDataRange().getValues().shift();
  var colIndex = headers.indexOf(dateTimeHeader);

  if (colIndex>=0){
    return colIndex+1;  
  }

  return -1
}

// Read config by name (sheetName)
function getSheetConfig(configName){
  return CONFIGS[configName]
}

// Handle to loop all the changes and add dateTime
function handleAddDateTime(sheet, range){
  var sheetName = sheet.getName()
  var sheetConfig = getSheetConfig(sheetName)

  if(!sheetConfig){
    Logger.log(`sheet config is not available for ${sheetName}`)
    return
  }

  var dateTimeCol = getDatetimeCol(sheetName, sheetConfig.dateTimeColHeader)
    if(dateTimeCol<0){
    Logger.log(`no header found for ${sheetName} - ${sheetConfig.dateTimeColHeader}`)
    return
  }

  for(let j=0; j<range.getNumColumns(); j++){
    var colIndex = range.getColumn() + j;
    if(colIndex != sheetConfig.inputColIndex){
      Logger.log(`not handle for this column ${colIndex}`)
      continue
    }

    for(let i=0; i<range.getNumRows(); i++){
      var rowIndex = range.getRow() + i;
      var cell = sheet.getRange(rowIndex, colIndex);
      if(cell.isBlank()){
        continue
      }
      addDateTimeValue(sheet, rowIndex, dateTimeCol)
    }
  }
}

// Add dateTime to cell
function addDateTimeValue(sheet, rowIndex, dateTimeCol){
  var datecell = sheet.getRange(rowIndex, dateTimeCol);
  Logger.log(`addDateTimeValue to ${rowIndex}:${dateTimeCol}: ${JSON.stringify(datecell)}`)
  if (datecell.isBlank()) {      
    datecell.setValue(new Date()).setNumberFormat(DATE_TIME_FORMAT);
  }
}