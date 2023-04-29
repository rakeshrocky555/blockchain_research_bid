const getPapers = "SELECT * FROM registered_papers";
const getPapers_uid = "SELECT author_address, paper_name FROM registered_papers where uid = $1";
const postPapers = "INSERT into registered_papers(author_address, paper_name, uid, paper_data) VALUES ($1, $2, $3, $4)";
const deletePapers = "DELETE FROM registered_papers where uid = $1";

module.exports = {
    getPapers,
    getPapers_uid,
    postPapers,
    deletePapers,
};