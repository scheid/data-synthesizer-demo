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

  logNormalDist: number[];
  exponentialDist: number[];
  normalDist: number[];

  constructor(private dataSynthesizerService: DataSynthesizerService) {

    this.recordCount = DataSynthConfig.recordsToGenerate;
    this.start = new Date().getTime();

    this.dataSynthesizerService.generateDataset(DataSynthConfig).subscribe(
      (data) => {
        this.end = new Date().getTime();
        this.genTimeMsec = this.end - this.start;
        // console.log('dataset ', data);
        this.generatedDataset = data;
      },
      (err) => {
        console.log('error generating data set', err);
      }
    );

    // for lognormal low sigmas (<1) will result in more of a spread of the data, esp. with low mu (~1)
    // remember lognormal is always zero low bounded

    // I wonder if for data generation, could define something where I use a mu of 1 and add a constant
    // to the generated values, so that the set is still low bounded by that constant.
    // might be more useful for some cases.
    this.dataSynthesizerService.getLogNormalDistributionVariates(1, 0.8, true, 500).subscribe(

      (data) => {
        // console.log('lognormal', data);
        this.logNormalDist = data;
      }
    );


    this.dataSynthesizerService.getExponentialDistributionVariates(1, 500).subscribe(

      (data) => {
        // console.log('exponentialDist', data);
        this.exponentialDist = data;
      }
    );


    this.dataSynthesizerService.getNormalDistributionVariates(80, 5, 1000).subscribe(

      (data) => {
        // console.log('normalDist', data);
        this.normalDist = data;
      }
    );



  }


  formatDate(val) {

    return moment(val).format('DD MMM YYYY HH:mm:ss');
  }


}
