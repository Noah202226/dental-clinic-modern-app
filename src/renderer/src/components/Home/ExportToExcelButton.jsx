import { utils, write } from 'xlsx'

const ExportToExcelButton = ({ sales, expenses }) => {
  console.log(sales)
  console.log(expenses)

  const exportToExcel = () => {
    // Exclude fields (_id and __v) when extracting column headers
    const headers = Object.keys(sales[0]).filter((key) => !['_id', '__v'].includes(key))

    // Exclude fields (_id and __v) when mapping data objects to arrays of values
    const rows = sales.map(({ _id, __v, ...obj }) => Object.values(obj))

    // Prepend headers to the rows array
    const excelData = [headers, ...rows]

    // Create a new workbook
    const workbook = utils.book_new()

    // Create a new worksheet
    const worksheet = utils.aoa_to_sheet(excelData)

    // Customize cell widths
    const columnWidths = headers.map((header) => ({ wch: header.length + 15 }))
    worksheet['!cols'] = columnWidths

    // Define the starting row index
    const startRow = 15 // Adjust this value to set the desired starting row

    // Shift the existing rows in the worksheet to accommodate the starting row
    for (let i = 0; i < rows.length; i++) {
      worksheet[utils.encode_cell({ r: i + startRow, c: 0 })] = { t: 's', v: rows[i][0] }
      for (let j = 1; j < rows[i].length; j++) {
        worksheet[utils.encode_cell({ r: i + startRow, c: j })] = { t: 'n', v: rows[i][j] }
      }
    }

    // Add the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, 'Sales')
    utils.book_append_sheet(workbook, worksheet, 'Expenses')

    // Convert the workbook to an array buffer
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' })

    // Save the Excel file
    saveExcelFile(
      excelBuffer,
      `${Date.now().toLocaleString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric'
      })} - Exported Sales.xlsx`
    )
  }

  const saveExcelFile = (buffer, filename) => {
    const data = new Blob([buffer], { type: 'application/octet-stream' })

    // Create a temporary link element
    const link = document.createElement('a')
    link.href = URL.createObjectURL(data)
    link.download = filename

    // Programmatically trigger a click event on the link element
    link.click()

    // Clean up the URL object after the file has been downloaded
    setTimeout(() => {
      URL.revokeObjectURL(link.href)
    }, 100)
  }

  return <button onClick={exportToExcel}>Export to Excel</button>
}

export default ExportToExcelButton
