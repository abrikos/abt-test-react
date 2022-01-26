import RAC from "react-apexcharts"
import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';

export default function Chart() {
    const items = useSelector((state) => state.userList)
    const [series, setSeries] = useState([])
    const [chartOptions, setChartOptions] = useState({
        chart: {
            height: 350,
            type: 'line',
            stacked: false
        },
        stroke: {
            width: [0, 4]
        },
        title: {
            text: 'Histogram'
        },
        dataLabels: {
            enabled: true,
            formatter: v => v % 1 === 0 ? v : v.toFixed(2),
            // enabledOnSeries: [0]
        },
        labels: [],
        // TODO add axis for percent
        yaxis: [{
            labels: {
                formatter: v => v % 1 === 0 ? v : v.toFixed(2),
            },
            logarithmic: false,
            min: 0,
            title: {
                text: 'Users',
            },

        }]
    });

    function switchSeries(name) {
        const seriesTmp = [...series];
        if (!series.find(s => s.name === name)) {
            const seriesNew = {
                name,
                type: 'line',
            }
            const gist = getHistData();
            switch (name) {
                case 'Percent':
                    // TODO fix apexchart bug: new yaxis does not apply on chart
                    const yaxis = {
                        seriesName: name,
                        labels: {
                            formatter: v => v % 1 === 0 ? v : v.toFixed(2),
                        },
                        logarithmic: false,
                        min: 0,
                        max: 100,
                        title: {
                            text: name,
                        },

                    }
                    seriesNew.data = calcPercent(gist);
                    const options = {...chartOptions};
                    options.yaxis.push(yaxis)
                    setChartOptions(options)
                    break;
                case 'Average':
                    seriesNew.data = calcAverage(gist);
                    break;
                case 'Median':
                    seriesNew.data = calcMedian(gist);
                    break;
            }
            seriesTmp.push(seriesNew)
            setSeries(seriesTmp)
        } else {
            setSeries(series.filter(s => s.name !== name))
        }

    }

    function calcPercent(data) {
        const values = Object.values(data);
        const percentile = {};
        for (const v of values) {
            if (!percentile[v]) {
                percentile[v] = 1;
            } else {
                percentile[v]++;
            }
        }
        for (const v of Object.keys(percentile)) {
            percentile[v] = percentile[v] / values.length * 100;
        }
        const ret = [];
        for (const days of Object.keys(data)) {
            ret.push(percentile[data[days]])
        }
        console.log(ret)
        return ret;
    }

    function calcAverage(data) {
        let sum = 0;
        for (const days of Object.keys(data)) {
            sum += data[days];
        }
        const average = sum / Object.keys(data).length;
        const ret = [];
        for (const d in data) ret.push(average);
        return ret;
    }

    function calcMedian(data) {
        const values = Object.values(data);
        values.sort(function (a, b) {
            return a - b;
        });
        const half = Math.floor(values.length / 2);
        let median = (values[half - 1] + values[half]) / 2;
        if (values.length % 2)
            median = values[half];
        const ret = [];
        for (const d in data) ret.push(median);
        return ret;
    }

    function drawData() {
        const options = {...chartOptions};
        const ser = {
            name: 'Users per day',
            type: 'bar',
            data: []
        }
        const labels = [];
        const gist = getHistData();
        for (const days of Object.keys(gist)) {
            labels.push(days);
            ser.data.push(gist[days]);
        }
        options.labels = labels;
        setChartOptions(options);
        setSeries([ser]);
    }

    useEffect(() => {
        drawData();
    }, [items])

    function getHistData() {
        const gist = {};
        for (const item of items) {
            if (!gist[item.lifeDays]) {
                gist[item.lifeDays] = 1;
            } else {
                gist[item.lifeDays]++;
            }
        }
        return gist;
    }

    return <div>
        <RAC options={chartOptions} series={series} type="line" height={350}/>
        <div className="d-flex justify-content-around">
            <div>
                <input type="checkbox" onChange={() => switchSeries('Average')}/> Average
            </div>
            <div>
                <input type="checkbox" onChange={() => switchSeries('Median')}/> Median
            </div>
            <div>
                <input type="checkbox" onChange={() => switchSeries('Percent')}/> Percent
            </div>
        </div>
    </div>
}
