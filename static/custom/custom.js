/* part 1: gist plugin */
/*
Add the contents of this file to your custom.js
for it to always be on.
*/


IPython.ext_update_gist_link = function(gist_id) {
    
    IPython.notebook.metadata.gist_id = gist_id;
    var toolbar = IPython.toolbar.element;
    var link = toolbar.find("a#nbviewer");
    if ( ! link.length ) {
        link = $('<a id="nbviewer" target="_blank"/>');
        toolbar.append(
            $('<span id="nbviewer_span"/>').append(link)
        );
    }
    
    link.attr("href", "http://nbviewer.ipython.org/" + gist_id);
    link.text("http://nbviewer.ipython.org/" + gist_id);
};

IPython.ext_handle_gist_output = function(output_type, content) {
    if (output_type != 'stream' || content['name'] != 'stdout') {
        return;
    }
    var gist_id = jQuery.trim(content['data']);
    if (! gist_id.match(/[A-Za-z0-9]+/g)) {
        alert("Gist seems to have failed: " + gist_id);
        return;
    }
    IPython.ext_update_gist_link(gist_id);
};

IPython.ext_gist_notebook = function () {
    var gist_id = IPython.notebook.metadata.gist_id || null;
    var cmd = '_nbname = "' + IPython.notebook.notebook_name + '.ipynb"';
    cmd = cmd + '\nlines = !jist -p'
    if (gist_id) {
        cmd = cmd + ' -u ' + gist_id;
    }
    cmd = cmd + ' "$_nbname"';
    cmd = cmd + '\nprint lines[0].replace("https://gist.github.com", "").replace("/","")';
    IPython.notebook.kernel.execute(cmd, {'output' : IPython.ext_handle_gist_output});
};

$([IPython.events]).on('notebook_loaded.Notebook', function() {
    if (IPython.notebook.metadata.gist_id) {
        IPython.ext_update_gist_link(IPython.notebook.metadata.gist_id);
    };
});

$([IPython.events]).on('app_initialized.NotebookApp', function(){

    IPython.toolbar.add_buttons_group([
        {
            'label'   : 'Share Notebook as gist',
            'icon'    : 'icon-share',
            'callback': IPython.ext_gist_notebook,
            'id'      : 'gist_notebook'
        },
    ]);
});
