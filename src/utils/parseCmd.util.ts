const QUOTE = ["'", "\"", "`"];
const SPACE = [" ", "\t", "\n"];
const ESCAPE = "\\";

export function parseCmd(cmd: string): string[] {
  const result: string[] = [];
  let current = "";
  let idx = 0;
  let quoting = "";
  function endPart(force=false) {
    if(!force && !current)
      return;
    result.push(current);
    current = "";
  }
  function consume(content: string) {
    current+=content;
    idx+=content.length;
  }
  function skip(content: string) {
    idx+=content.length;
  }
  for(;idx < cmd.length;) {
    const char = cmd[idx];
    if(char===ESCAPE) {
      const next = cmd[idx+1];
      if(!next) {
        throw Error("No escape character");
      }
      skip(char);
      consume(next);
    } else if(QUOTE.includes(char)) {
      if(quoting===char) {
        skip(char);
        quoting = "";
        endPart();
      } else if(!quoting) {
        skip(char);
        quoting = char;
      } else {
        consume(char);
      }
    } else if (SPACE.includes(char) && !quoting){
      skip(char);
      endPart();
    } else {
      consume(char);
    }
  }
  if(quoting) {
    throw Error("Unterminated quoted string");
  }
  endPart();
  return result;
}
