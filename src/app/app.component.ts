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

        let i = 0;
        let wtTmp = [];
        for (i = 0; i < DataSynthConfig.recordsToGenerate; i++) {
          wtTmp.push(data[i].weight_lbs);
        }
        console.log('wtTmp', wtTmp.join('|'));

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
