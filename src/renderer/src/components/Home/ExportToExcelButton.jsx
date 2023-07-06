import { utils, write, writeFile } from 'xlsx'

const ExportToExcelButton = ({ sales, expenses }) => {
  const electronFs = window.electronFs

  const exportToExcel = () => {
    try {
      // Create a new workbook
      const workbook = utils.book_new()

      // Create a new worksheet
      const worksheet = utils.aoa_to_sheet([])

      // Set the title value directly to cell A1
      worksheet['A1'] = { t: 's', v: 'Title' }

      // Add the worksheet to the workbook
      utils.book_append_sheet(workbook, worksheet, 'Sheetsss1')

      // Save the workbook to an Excel file buffer
      const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' })
      saveExcelFile(excelBuffer, 'output2.xlsx')
    } catch (e) {
      console.log(e)
    }
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
