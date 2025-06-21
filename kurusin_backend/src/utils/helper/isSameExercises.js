const isSameExercises = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (
            a[i].id_exercise !== b[i].id_exercise ||
            !Array.isArray(a[i].sets) ||
            !Array.isArray(b[i].sets) ||
            a[i].sets.length !== b[i].sets.length ||
            !a[i].sets.every(set => b[i].sets.includes(set))
        ) {
            return false;
        }
    }
    return true;
};

module.exports = isSameExercises;