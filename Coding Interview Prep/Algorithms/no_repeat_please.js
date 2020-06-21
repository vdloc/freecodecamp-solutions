function permAlone(str) {
  const chars = [...str];

  const allPerms = chars.reduce((perms, char, index) => {
    const charPerms = chars
      .map((_, singleIndex) => {
        if (singleIndex !== index) {
          const copyChars = [...chars];

          [copyChars[index], copyChars[singleIndex]] = [
            copyChars[singleIndex],
            copyChars[index],
          ];

          return copyChars;
        }
      })
      .filter(
        (chars) =>
          chars &&
          !chars.some((char, index) => {
            if (index) {
              return chars[index - 1] === char || chars[index + 1] === char;
            }
          })
      );

    return perms.concat(charPerms);
  }, []);

  console.log("permAlone -> allPerms", allPerms);
  return allPerms.lenght;
}

const perm = permAlone("aabb");
console.log("perm", perm);
