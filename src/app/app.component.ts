import { Component } from '@angular/core';
import { DataSynthesizerService } from 'data-synthesizer';
import * as moment from 'moment';
import DataSynthConfig from './data-synth-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: 'rndSeed', useValue: 238766}  // this will be auto injected into the data synthesizer service
  ]
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


  weightDistribution: number[];
  heightDistribution: number[];
  bmiDistribution: number[];

  dataCfg: any;

  constructor(private dataSynthesizerService: DataSynthesizerService) {

    this.dataCfg = DataSynthConfig;
    this.recordCount = DataSynthConfig.recordsToGenerate;
    this.start = new Date().getTime();

    this.heightDistribution = [];
    this.weightDistribution = [];
    this.bmiDistribution = [];

    this.dataSynthesizerService.generateDataset(DataSynthConfig).subscribe(
      (data) => {
        this.end = new Date().getTime();
        this.genTimeMsec = this.end - this.start;
        this.generatedDataset = data;


        console.log('data', data);

        let i = 0;

        for (i = 0; i < data.length; i++) {
          this.weightDistribution.push(data[i].weight_lbs);
          this.heightDistribution.push(data[i].height_inches);
          this.bmiDistribution.push(data[i].bmi);
        }

       // this.weightDistribution = _tmp1;


      },
      (err) => {
        console.log('error generating data set', err);
      }
    );



    // NOTE: if you are using only the low level functions, then you'll need to
    // seed the generator manully using: this.dataSynthesizerService.setSeed(2398765);
    // with whatever you want for your seed
    // setSeed returns an Observable<boolean> (true if successful) so you'll need to handle appropriately; waiting to call your random
    // functions until setseed returns with true

    // if you use the generateDataset function, that will seed the generator, and you can use your low level functions inside the subscribed function for generateDataset


    // the synthesizer service also has lower level functions that will give you raw generated random data. Some
    // of these functions are shown below.  All functions return an observable.

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
