import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

import styles from "./Graph.module.css";

const TempratureGraph = ({ dataBar, width, height, labelColor  }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Create or update the chart
    const ctx = chartRef.current.getContext('2d');

    // Ensure that the previous chart instance is destroyed
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Set the width and height of the chart by adjusting the attributes
    chartRef.current.width = width || 10; // Set the desired width in pixels, or use a default value
    chartRef.current.height = height || 10; // Set the desired height in pixels, or use a default value


    // Create the chart with the new data
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dataBar.labels,
        datasets: [
          {
            label: dataBar.label,
            data: dataBar.values,
            backgroundColor: 'orange',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
            x: {
                grid: {
                    color: 'white', // Change the color of the X-axis grid lines
                  },
                  ticks: {
                    color: 'white', // Change the color of the X-axis labels
                  },
            },

          y: {
            beginAtZero: true,
            grid: {
                color: 'white', // Change the color of the Y-axis grid lines
              },
              ticks: {
                color: 'white', // Change the color of the Y-axis labels
              },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: labelColor, // Set the font color of the label
            },
          },
        },
      },
    });

    // Clean up when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [dataBar, width, height]);

  return (
    <div className={styles["graph"]}>
      <canvas ref={chartRef} width="400" height="200"></canvas>
    </div>
  );
};

export default TempratureGraph;