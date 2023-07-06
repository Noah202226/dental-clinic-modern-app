import React, { useState } from 'react'
import ExcelJS from 'exceljs'
import { Button } from '@mui/material'
import {
  DownloadForOfflineRounded,
  DownloadOutlined,
  DownloadingRounded
} from '@mui/icons-material'
import { toast } from 'react-toastify'

const ExcelJSButton = ({ sales, expenses, firstDay, lastDay }) => {
  const [isSaving, setIsSaving] = useState(false)

  const handleExportToExcel = () => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('SALES', {
      properties: { tabColor: { argb: '0CC2000' } }
    })
    // Create worksheets with headers and footers
    const sheet2 = workbook.addWorksheet('EXPENSES', {
      properties: { tabColor: { argb: '0CC2000' } }
    })

    const capitalizeData = (data) => {
      const capitalizedDataArr = []
      data.map((text) => {
        // Split the text into an array of words
        var words = text.split(' ')

        // Capitalize the first letter of each word
        var capitalizedWords = words.map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1)
        })

        // Join the capitalized words back into a single string
        var capitalizedText = capitalizedWords.join(' ')

        // Return the capitalized text

        capitalizedDataArr.push(capitalizedText)
      })

      return capitalizedDataArr
    }

    // Exclude fields (_id and __v) when extracting column headers
    const headers = Object.keys(sales[0]).filter((key) => !['_id', '__v'].includes(key))
    const expensesHeaders = Object.keys(expenses[0]).filter((key) => !['_id', '__v'].includes(key))
    const capitalizeHeaders = capitalizeData(headers)
    const capitalizeExpensesHeaders = capitalizeData(expensesHeaders)

    // Exclude fields (_id and __v) when mapping data objects to arrays of values

    const formattedRows = sales.map((row) => {
      const { dateTransact, ...rest } = row
      const date = new Date(dateTransact)
      const formattedDate = date.toLocaleDateString()
      return { dateTransact: formattedDate, ...rest }
    })
    const rows = formattedRows.map(({ _id, __v, ...obj }) => Object.values(obj))

    const formattedExpenseRows = expenses.map((row) => {
      const { dateTransact, ...rest } = row
      const date = new Date(dateTransact)
      const formattedDate = date.toLocaleDateString()

      return { dateTransact: formattedDate, ...rest }
    })
    const expensesRows = formattedExpenseRows.map(({ _id, __v, ...obj }) => Object.values(obj))

    // Title App
    const excelSalesTitle = sheet.getCell('A1')
    excelSalesTitle.font = { bold: true, size: 18 }
    excelSalesTitle.value = 'Dental Clinic Sales'

    const excelExpensesTitle = sheet2.getCell('A1')
    excelExpensesTitle.font = { bold: true, size: 18 }
    excelExpensesTitle.value = 'Dental Clinic Expenses'

    // Data computation
    const dateRange = sheet.getCell('A2')
    dateRange.font = { bold: true, size: 14 }
    dateRange.value = 'Date Range:'
    const dateRangeFirst = sheet.getCell('B2')
    dateRangeFirst.font = { bold: true, size: 13, italic: true }
    dateRangeFirst.value = `${firstDay} to ${lastDay}`

    const totalSalesLabel = sheet.getCell('D2')
    totalSalesLabel.font = { bold: true, size: 14 }
    totalSalesLabel.value = 'Total Sales:'
    const totalSales = sheet.getCell('E2')
    totalSales.font = { bold: true, size: 13, italic: true }
    totalSales.value = sales.reduce((a, b) => a + b.amountPaid, 0)

    const dateRange2 = sheet2.getCell('A2')
    dateRange2.font = { bold: true, size: 14 }
    dateRange2.value = 'Date Range:'
    const dateRangeFirst2 = sheet2.getCell('B2')
    dateRangeFirst2.font = { bold: true, size: 13, italic: true }
    dateRangeFirst2.value = `${firstDay} to ${lastDay}`

    const totalExpenseLabel = sheet2.getCell('D2')
    totalExpenseLabel.font = { bold: true, size: 14 }
    totalExpenseLabel.value = 'Total Expenses:'
    const totalExpense = sheet2.getCell('E2')
    totalExpense.font = { bold: true, size: 13, italic: true }
    totalExpense.value = expenses.reduce((a, b) => a + b.amountPaid, 0)

    const headerRow = sheet.addRow(capitalizeHeaders)
    const expenseHeaderRow = sheet2.addRow(capitalizeExpensesHeaders)

    headerRow.font = { bold: true }
    expenseHeaderRow.font = { bold: true }

    sheet.columns[0].width = 50
    sheet.columns[1].width = 30
    sheet.columns[2].width = 30
    sheet.columns[3].width = 30
    sheet.columns[4].width = 20

    sheet2.columns[0].width = 50
    sheet2.columns[1].width = 30
    sheet2.columns[2].width = 30
    sheet2.columns[3].width = 30
    sheet2.columns[4].width = 30

    rows.forEach((rowData) => {
      sheet.addRow(rowData)
    })
    expensesRows.forEach((rowData) => {
      sheet2.addRow(rowData)
    })

    // Generate the Excel file
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        if (buffer.byteLength == 0) return

        setIsSaving(true)
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Dental Clinic Reports - ${new Date(
          firstDay
        ).toLocaleDateString()} to ${new Date(lastDay).toLocaleDateString()}.xlsx`
        link.click()

        // Wait for the file to be downloaded, then show the success notification
        isSaving
          ? toast.error('File saved.', {
              position: 'top-center',
              containerId: 'transactionsNofity'
            })
          : ''
      })
      .catch((error) => {
        toast.error('Error saving excel file. =>' + error.message, {
          position: 'top-center',
          containerId: 'transactionsNofity'
        })
      })
  }

  return (
    <Button onClick={handleExportToExcel} variant="contained">
      Export to Excel using ExcelJS
      <DownloadForOfflineRounded />
    </Button>
  )
}

export default ExcelJSButton
