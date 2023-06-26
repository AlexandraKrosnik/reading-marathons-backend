const checkAndUpdateTrainingStatus = (training) => {
  if (training.status === "finished") {
    return "finished";
  }
  const currentDate = new Date();

  const isAllFinishedBooks = training.statistics.filter((statistic) => {
    // console.log(statistic);
    return (
      Number(statistic.book.pages) !==
      Number(statistic.statisticsPages.readPages)
    );
  });
  if (isAllFinishedBooks.length === 0) {
    return "finished";
  }

  // Перевіряємо дати початку і закінчення тренування
  if (currentDate >= training.start && currentDate <= training.finish) {
    // Тренування є активним
    return "active";
  } else if (currentDate > training.finish) {
    // Тренування вже завершено
    return "finished";
  } else {
    // Тренування заплановане
    return "planned";
  }
};

module.exports = checkAndUpdateTrainingStatus;
