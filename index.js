var ViewModel = function () {

    var self = this;

    self.patterns = ko.observableArray([]);

    /// for array creation
    self.arrayBegin = ko.observable(0);
    self.arrayCount = ko.observable(10);
    self.arrayStep = ko.observable(1);

    self.insertArray = function () {
        var begin = 1 * self.arrayBegin();
        var count = 1 * self.arrayCount();
        var step = 1 * self.arrayStep();

        var str = "";

        for (let i = 0; i < count; i++) {
            const e = begin + i * step;
            str += e.toString() + "\n";
        }
        self.input(str);
    }

    self.buttonClass = function(tailwindColorName){
        return `text-white bg-gradient-to-r from-${tailwindColorName}-500 via-${tailwindColorName}-600 to-${tailwindColorName}-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-${tailwindColorName}-300 dark:focus:ring-${tailwindColorName}-800 shadow-lg shadow-${tailwindColorName}-500/50 dark:shadow-lg dark:shadow-${tailwindColorName}-800/80 font-medium rounded-lg text-sm px-5 py-2 text-center`;
    }

    self.resetInput = function(){
        self.input('');
        self.setInput();
        self.getInput();
    }

    // create classes for buttons
    self.buttonClasses = function(){
        var d = [];
        const colors = ["sky", "red", "green", "violet", "amber"];
        for (let i = 0; i < colors.length; i++) {
            const color = colors[i];
            const coldef = self.buttonClass(color);
            d.push(`
            .btn-${color} {
                @apply ${coldef};
            }

            `);
        }

        
        console.log(d.join(' '));
    }

    /// /for array creation

    self.copyToClipboard = function () {
        //data-bind="text: output"
        var o = document.querySelector("[data-bind='text: output'");
        if (o) {
            if (navigator.clipboard.writeText) {
                navigator.clipboard.writeText(o.value);
            }
        }
    }

    

    self.getInput = function () {
        var i = localStorage.getItem("input");
        if (i) {
            self.input(i);
        }
        else{
            self.input('Emri string\nMbiemri string\nDatelindja DateOnly\nEmriIBabes string');
        }
    }
    self.setInput = function () {
        localStorage.setItem("input", self.input());
    }

    self.getPatterns = function () {
        var json = localStorage.getItem("patterns");
        if (!json) {
            json = '["public {1} {0} { get; set; } = {2};\\n","private {1} _{0} = default;\\npublic {1} {0} \\n{\\n  get {\\n    return _{0};\\n  }\\n  set {\\n    _{0} = value;\\n  }\\n}  \\n","<input type=\\"text\\" id=\\"{0!camel}\\" name=\\"{0!Kebap}\\" class=\\"\\" />\\n"]';
        }
        self.patterns(JSON.parse(json));
        if(self.patterns().length > 0){
            self.pattern(self.patterns()[0]);
        }
    }

    self.setPatterns = function () {
        localStorage.setItem("patterns", JSON.stringify(self.patterns()));
    }

    self.addPattern = function () {
        self.patterns.push(self.pattern());
        self.setPatterns();
    }

    self.downloadPatterns = function () {

        function download(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }

        // Start file download.
        download("patterns.json", JSON.stringify(self.patterns()));

    }

    self.removePattern = function () {
        function arrayRemove(arr, value) {
            return arr.filter(function (ele) {
                return ele != value;
            });
        }

        var p = self.patterns();
        var v = self.pattern();
        p = arrayRemove(p, v)
        self.patterns(p);
        self.setPatterns()
    }

    self.updatePattern = function () {
        var s = self.selectedPattern();
        var p = self.pattern();
        var t = self.patterns();

        for (let i = 0; i < t.length; i++) {
            if (s == t[i]) {
                t[i] = p;
            }
        }
        self.patterns(t);
        self.selectedPattern(self.pattern());
        self.setPatterns();
    }

    self.patternChanged = function () {
        self.pattern(self.selectedPattern());
    }

    self.input = ko.observable('Id int\nName string\nDoB System.DateTime');
    self.input.subscribe(function () {
        self.setInput();
    });
    self.pattern = ko.observable('');
    self.selectedPattern = ko.observable('');

    self.output = ko.pureComputed(function () {
        if (self.input() != '' && self.pattern() != '') {
            var ol = [];
            var pattern = self.pattern();

            var lines = self.input().split(/\n/g)

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if(line == "") continue;
                
                var parts = line.split(' ');
                var p = pattern;
                for (let j = 0; j < parts.length; j++) {
                    const part = parts[j];

                    var reg = new RegExp("\\{" + j + "\\}", "g");
                    if (p.search(reg) > -1) {
                        p = p.replace(reg, part);
                    }

                    reg = new RegExp("\\{!index\\}", "g");
                    if (p.search(reg) > -1) {
                        var ptlc = i;
                        p = p.replace(reg, i);
                    }

                    reg = new RegExp("\\{" + j + "!camel\\}", "g");
                    if (p.search(reg) > -1) {
                        var ptlc = part[0].toLowerCase() + part.substring(1);
                        p = p.replace(reg, ptlc);
                    }
                    reg = new RegExp("\\{" + j + "!lower\\}", "g");
                    if (p.search(reg) > -1) {
                        var ptlc = part.toLowerCase();
                        p = p.replace(reg, ptlc);
                    }
                    reg = new RegExp("\\{" + j + "!upper\\}", "g");
                    if (p.search(reg) > -1) {
                        var ptlc = part.toUpperCase();
                        p = p.replace(reg, ptlc);
                    }

                    reg = new RegExp("\\{" + j + "!Camel\\}", "g");
                    if (p.search(reg) > -1) {
                        var ptlc = part[0].toUpperCase() + part.substring(1);
                        p = p.replace(reg, ptlc);
                    }

                    reg = new RegExp("\\{" + j + "!pascal\\}", "g");
                    if (p.search(reg) > -1) {
                        var ptlc = part[0].toUpperCase() + part.substring(1);
                        p = p.replace(reg, ptlc);
                    }

                    reg = new RegExp("\\{" + j + "!snake\\}", "g");
                    if (p.search(reg) > -1) {                        
                        var ptlc = part.replace(/([A-Z])/g, function(v) { return "_" + v[0].toLowerCase() + v.substring(1); });
                        ptlc = ptlc.substring(1);
                        p = p.replace(reg, ptlc);
                    }

                    reg = new RegExp("\\{" + j + "!screamingsnake\\}", "g");
                    if (p.search(reg) > -1) {                        
                        var ptlc = part.replace(/([A-Z])/g, function(v) { return "_" + v[0].toUpperCase() + v.substring(1); });
                        ptlc = ptlc.substring(1).toUpperCase();
                        p = p.replace(reg, ptlc);
                    }

                    reg = new RegExp("\\{" + j + "!kebap\\}", "g");
                    if (p.search(reg) > -1) {                        
                        var ptlc = part.replace(/([A-Z])/g, function(v) { return "-" + v[0].toLowerCase() + v.substring(1); });
                        ptlc = ptlc.substring(1);
                        p = p.replace(reg, ptlc);
                    }

                    reg = new RegExp("\\{" + j + "!Kebap\\}", "g");
                    if (p.search(reg) > -1) {                        
                        var ptlc = part.replace(/([A-Z])/g, function(v) { return "-" + v[0].toLowerCase() + v.substring(1); });
                        ptlc = ptlc.substring(1).toUpperCase();
                        p = p.replace(reg, ptlc);
                    }

                }
                ol.push(p);
            }

            return ol.join('');
        }
        else {
            return '...';
        }
    }, self);

}

function getFileText(file) {
    var reader = new FileReader();
    //reader.readAsDataURL(file);
    //reader.readAsArrayBuffer(file);
    reader.readAsText(file, "UTF-8");
    reader.onload = function () {
        localStorage.setItem("patterns", reader.result);
        model.getPatterns();
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

fileChanged = function (e) {
    var files = e.target.files;
    var file = files[0];
    getFileText(file);
}

var model = new ViewModel();
ko.applyBindings(model);
model.getInput();
model.getPatterns();