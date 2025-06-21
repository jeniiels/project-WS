const calculateDuration = (duration1, duration2) => {
    const regex = /^(\d+)h\s(\d+)min$/;

    const match1 = duration1.match(regex);
    const match2 = duration2.match(regex);

    if (!match1 || !match2) throw new Error("Format duration tidak valid.");

    let hours = parseInt(match1[1]) + parseInt(match2[1]);
    let minutes = parseInt(match1[2]) + parseInt(match2[2]);

    if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;
    }

    return `${hours}h ${minutes}min`;
};

module.exports = calculateDuration;