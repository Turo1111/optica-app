export const useDate = (dateConvert) => {
    var today = new Date();

    var day = dateConvert ? dateConvert.getDate() : today.getDate();
    var formattedDay = day < 10 ? `0${day}` : day;

    var month = dateConvert ? dateConvert.getMonth() + 1 : today.getMonth() + 1;
    var formattedMonth = month < 10 ? `0${month}` : month;

    var year = dateConvert ? dateConvert.getFullYear() : today.getFullYear();

    const date = `${year}-${formattedMonth}-${formattedDay}`;

    return { date };
};