const cumulativeAverage = (preAvg, newData, listLength) => {
  const oldWeight = (listLength - 1) / listLength;
  const newWeight = 1 / listLength;

  return (preAvg * oldWeight) + (newData * newWeight);
}

export default cumulativeAverage;
