import {Component, OnInit, ViewChild, Input} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'simple-histogram',
  templateUrl: './simple-histogram.component.html',
  styleUrls: ['./simple-histogram.component.scss']
})
export class SimpleHistogramComponent implements OnInit {

  @ViewChild('chartContents', {static: false}) chartContents;
  _data: number[];

  binCount: number;

  @Input()
  set data(vals: number[]) {
    this._data = vals;
    this.drawChart();
  }

  constructor() {

    this.binCount = 50;
  }

  ngOnInit() {
  }

  drawChart() {

    if (!this._data) { return; }

// set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 700 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;


// append the svg object to the body of the page
    const svg = d3.select(this.chartContents.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // X axis: scale and draw:
    const x = d3.scaleLinear()
      .domain([0, d3.max(this._data, (d) => d)])
      .range([0, width]);

    svg.append('g')
      .classed('hist-axis', true)
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // set the parameters for the histogram
    const histogram = d3.histogram()
      .value((d) => d )   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(this.binCount)); // then the numbers of bins

    // And apply this function to data to get the bins
    const bins = histogram(this._data);

    // Y axis: scale and draw:
    const y = d3.scaleLinear()
      .range([height, 0]);
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously

    svg.append('g')
      .classed('hist-axis', true)
      .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg.selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', 1)
      .attr('transform', function(d) { return 'translate(' + x(d.x0) + ',' + y(d.length) + ')'; })
      .attr('width', function(d) { return x(d.x1) - x(d.x0) - 1 ; })
      .attr('height', function(d) { return height - y(d.length); })
      .style('fill', '#568cce');

  }

}
