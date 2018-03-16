NAME            := iml-gui
PACKAGE_VERSION := 6.3.0
PACKAGE_RELEASE := 1

#BASEURL ?= $(PWD)/targetdir
#
#SOURCES     := $(find source)
#
## see https://stackoverflow.com/questions/2973445/ for why we subst
## the ".html" for "%html" to effectively turn this into a multiple
## matching target pattern rule
#$(subst .html,%html,$(HTML_FILES)): vendor/cache $(SOURCES)
#	bundle exec jekyll build --destination targetdir --baseurl \
#	    $(BASEURL) --incremental
#	find targetdir -name \*.md -print0 | xargs -0 rm -f
#
#view: targetdir
#	google-chrome-stable --new-window file://$$PWD/targetdir/index.html
#
#vendor/cache: Gemfile Gemfile.lock
#	bundle install --path vendor/cache
#	touch $@

install_build_deps:
	yum -y install https://rpm.nodesource.com/pub_8.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm
	yum -y install nodejs

targetdir: source index.ejs webpack.config.js package.json
	npm install
	npm run postversion
	touch $^


NPM_PREREQS := targetdir
include ./include/npm.mk
