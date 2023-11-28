{
    let dependencies = [];
}

pegjs_content = _ initializer:initializer? content:content* {
	return {
    	initializer,
      content: content.join(""),
      dependencies
    }
}

content = import { return '' }
/ c:(.) { 
	return c;
}

import = i:("@import"i _ "'" [^\']* "'" ";"? _ 
	/ "@import"i _ '"' [^\"]* '"' ";"? _
    / "@import"i _ "`" [^\`]* "`" ";"? _) {
    dependencies.push(i[3].join(""));
}

initializer = initializer: ("{" code_block "}") _ {
	return initializer[1];
}

code_block = factors: factor* {
  return _.flattenDeep(factors).join("");
}

factor = factors: ("{" code_block "}"/ exprChar+ &.) {
  return _.flattenDeep(factors).join("");
}

exprChar = [^\{\}]
	/ sp
  / newline
  / tab
        
_ "space" = (comment/sp/tab/newline)*
sp = " "
newline "newline" = "\r\n" / "\n"
tab = "\t"
comment "comment" = "//" [^\n]*
     