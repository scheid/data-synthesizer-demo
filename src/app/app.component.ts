import { Component } from '@angular/core';
import { DataSynthesizerService } from 'data-synthesizer';
import * as moment from 'moment';
import DataSynthConfig from './data-synth-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  generatedDataset: any;
  genTimeMsec: number;
  recordCount: number;
  start: number;
  end: number;

  constructor(private dataSynthesizerService: DataSynthesizerService) {

    this.recordCount = DataSynthConfig.recordsToGenerate;
    this.start = new Date().getTime();

    this.dataSynthesizerService.generateDataset(DataSynthConfig).subscribe(
      (data) => {
        this.end = new Date().getTime();
        this.genTimeMsec = this.end - this.start;
        console.log('dataset ', data);
        this.generatedDataset = data;



      },
      (err) => {
        console.log('error generating data set', err);
      }
    );




  }


  formatDate(val) {

    return moment(val).format('DD MMM YYYY HH:mm:ss');
  }


}
