module.exports = async (d) => {
  const split = d.code.split("$exec").length - 1;
  const after = d.code.split("$exec")[split];

  if (after.startsWith("[")) {
    const inside = d.code.split("$exec[")[1].split("]")[0];

    try {
      var execute = await require("child_process").execSync(inside);
    } catch (err) {
      d.isError = true;
      return d.error(`❌ [whatscode.js] | $exec error: ${err}!`);
    }

    return execute;
  } else {
    d.isError = true;
    return d.error(`❌ [whatscode.js] | Usage: $exec[code]!`);
  }
};
