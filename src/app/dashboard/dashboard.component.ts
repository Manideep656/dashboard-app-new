import { Component, ViewChild } from '@angular/core';
import { ChartType, ChartData, ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import * as XLSX from 'xlsx';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  // Properties for chart data, labels, options, and type
  pieChartData: ChartData<'pie', any, string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };
  // Chart options
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx?.chart?.data?.labels?.[ctx.dataIndex];
          return label ? label + ': ' + value : value;
        },
        font: {
          weight: 'bold',
        },
        color: 'black',
      },
    },
  };

  pieChartType: ChartType = 'pie';
  pieChartPlugins = [DatalabelsPlugin];

  // bar Chart options
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {},
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  barChartType: ChartType = 'bar';
  barChartPlugins = [DatalabelsPlugin];

  barChartData: ChartData<'bar'> = {
    // labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    // datasets: [
    //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    // ],
    labels: [],
    datasets: [
      { data: [], label: 'Series E' },
      { data: [99, 111, 40, 19], label: 'Series H' },
    ],
  };

  // Method to handle file change event
  onFileChange(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = new Uint8Array(e?.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(sheet);
      this.processExcelData(excelData);
    };
    fileReader.readAsArrayBuffer(file);
  }

  countStatus = (data: any, compareValue: string) => {
    let actualCount = data.reduce((count: number, value: string) => {
      if (value?.trim()?.toLocaleLowerCase() === compareValue) count++;
      return count;
    }, 0);
    return actualCount;
  };

  // Method to process Excel data and set chart data, labels, and options
  processExcelData(excelData: any[]) {
    // Extract data from excelData and format it as required for the pie chart
    const pieChartData = excelData.map((row) => row.tenantStatus);
    const pieChartLabels = excelData.map((row) => row.tenantStatus);

    let numOfActives = this.countStatus(pieChartData, 'active');

    let numOfInActives = this.countStatus(pieChartData, 'inactive');

    let numOfNew = this.countStatus(pieChartData, 'new');

    let numOfClosed = this.countStatus(pieChartData, 'closed');

    // Set the chart data, labels, and options
    this?.pieChartData?.datasets[0]?.data?.push(numOfActives);
    this?.pieChartData?.labels?.push(['Active']);

    this?.pieChartData?.datasets[0]?.data?.push(numOfInActives);
    this?.pieChartData?.labels?.push(['In-Active']);

    this?.pieChartData?.datasets[0]?.data?.push(numOfNew);
    this?.pieChartData?.labels?.push(['New']);

    this?.pieChartData?.datasets[0]?.data?.push(numOfClosed);
    this?.pieChartData?.labels?.push(['Closed']);

    // bar chart data setup
    this?.barChartData?.datasets[0]?.data?.push(numOfActives);
    this?.barChartData?.labels?.push('Active');

    this?.barChartData?.datasets[0]?.data?.push(numOfInActives);
    this?.barChartData?.labels?.push('In-Active');

    this?.barChartData?.datasets[0]?.data?.push(numOfNew);
    this?.barChartData?.labels?.push('New');

    this?.barChartData?.datasets[0]?.data?.push(numOfClosed);
    this?.barChartData?.labels?.push('Closed');

    this.chart?.update();
  }
}
