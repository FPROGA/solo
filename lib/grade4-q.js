/** @param {'A'|'B'|'C'|'D'} ans */
function Q(text, a, b, c, d, ans) {
  return {
    question_text: text,
    option_a: a,
    option_b: b,
    option_c: c,
    option_d: d,
    correct_answer: ans,
  };
}

module.exports = { Q };
