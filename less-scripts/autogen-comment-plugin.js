let autoGenCommentBlock = 
`/*!
 * This is a autogenerated file. Please don't change the content directly.
 * To change the css, change the same named .less file. 
 * After changing .less file, run 'npm run lessc' from terminal to autogenerate .css file.
 */`;

module.exports = {
    install: function(less, pluginManager, functions) {
        functions.add('autocomment', function() {
            return autoGenCommentBlock;
        });
    }
};