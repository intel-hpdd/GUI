NAME            := iml-gui
PACKAGE_VERSION := 6.4.2
PACKAGE_RELEASE := 1

ifeq ($(UNPUBLISHED),true)
  SCM_COMMIT_NUMBER	:= $(shell git rev-list HEAD | wc -l)
  PACKAGE_RELEASE := $(SCM_COMMIT_NUMBER).$(PACKAGE_RELEASE)
endif

install_build_deps:
	yum -y install https://rpm.nodesource.com/pub_8.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm
	yum -y install nodejs

targetdir: source index.ejs webpack.config.js package.json
	npm install
	npm run postversion
	touch $^


NPM_PREREQS := targetdir
include ./include/npm.mk
