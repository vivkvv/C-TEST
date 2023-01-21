//adds format function for string
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != "undefined" ? args[number] : match;
        });
    };
}

var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

class Declaration {
    m_type;
    m_variable;
    m_value;
    constructor(type, variable, value) {
        this.m_type = type;
        this.m_variable = variable;
        this.m_value = value;
    }
};

let declarations = [
    new Declaration("int", "x", "42"),
    new Declaration("const int & ", "cx", "x"),
    new Declaration("int *", "px", "&x"),
    new Declaration("const int *", "cpx", "&x"),
    new Declaration("int * &", "pz", "px"),
    new Declaration("const int * &", "cpz", "cpx"),
    new Declaration("const int * const", "pw", "px")
];

class AutoDeclaration {
    m_details_name;
    m_name;
    m_js_declaration;
    constructor(details_name, name) {
        this.m_details_name = details_name;
        this.m_name = name;
        this.m_js_declaration = `auto ${this.m_name} = ...`;
        this.m_html_declaration = escapeHtml(this.m_js_declaration);
    }
};

let autoDeclarations = [
    new AutoDeclaration("details_auto", "l")
];

class Function {
    m_details_name;
    m_name;
    m_js_declaration;
    m_html_declaration;
    m_param_type;
    constructor(details_name, name, param_type) {
        this.m_details_name = details_name;
        this.m_name = name;
        this.m_param_type = param_type;
        this.m_js_declaration = `template <typename T> void ${this.m_name}(${this.m_param_type} t)`;
        this.m_html_declaration = escapeHtml(this.m_js_declaration);
    }
};

let functions = [
    new Function("details_foo", "foo", "T"),
    new Function("details_bar", "bar", "T&"),
    new Function("details_buz", "buz", "T*"),
    new Function("details_bee", "bee", "T* const&")
];

let codes = {
    "boost":
        '#include <iostream>\n' +
        '#include <boost/type_index.hpp>\n' +
        '\n' +
        'using std::cout;\n' +
        'using std::endl;\n' +
        'using boost::typeindex::type_id_with_cvr;\n' +
        '\n' +
        '{0}\n' +
        '{\n' +
        '   cout << type_id_with_cvr<decltype(t)>().pretty_name() << endl;\n' +
        '}\n' +
        '\n' +
        '{1}\n' +
        '\n' +
        'int main()\n' +
        '{\n' +
        '   {2};\n' +
        '   return 0;\n' +
        '}\n',
    "linker":
        '#include <iostream>\n' +
        '\n' +
        'using std::cout;\n' +
        'using std::endl;\n' +
        '\n' +
        '{0};\n' +
        '\n' +
        '{1}\n' +
        '\n' +
        'int main()\n' +
        '{\n' +
        '   {2};\n' +
        '   return 0;\n' +
        '}\n',
    "compiler":
        '#include <iostream>\n' +
        '\n' +
        'template <typename T> struct TD;\n' +
        '{0}{\n' +
        '   TD<T> tType;\n' +
        '   TD<t> tParam;\n' +
        '};\n' +
        '\n' +
        '{1}\n' +
        '\n' +
        'int main()\n' +
        '{\n' +
        '   {2};\n' +
        '   return 0;\n' +
        '}\n'
};

