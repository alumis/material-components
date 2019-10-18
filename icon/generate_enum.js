require("https").get("https://raw.githubusercontent.com/google/material-design-icons/master/iconfont/codepoints", function (res) {
    res.setEncoding("utf8");
    let content = "";
    res.on("data", c => content += c);
    res.on("end", () => {
        let output = "";
        for (let l of content.split("\n")) {
            l = l.trim();
            let i = l.indexOf(" ");
            if (i !== -1) {
                let name = "";
                for (let w of (l = l.substr(0, i)).split("_"))
                    name += w[0].toUpperCase() + w.substr(1);
                output += `${name} = "${l}",\n`;
            }
        }
        require("fs").writeFile("enum.txt", output, () => {});
    });
});