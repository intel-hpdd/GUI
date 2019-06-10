BUILDROOT:=$(shell [ -d "/build" ] && echo "/build" || echo ".")
TMPDIR:=$(shell mktemp -d)

srpm:
	mkdir -p ${TMPDIR}/_topdir/SOURCES
	mkdir -p ${TMPDIR}/scratch
	rm -rf ${BUILDROOT}/_topdir
	curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

	cp -r source iml-gui.spec *.js *.json index.ejs ${TMPDIR}/scratch
	bash -c 'source /root/.bashrc && nvm install 10 && cd ${TMPDIR}/scratch && npm i && npm run postversion && npm pack'
	cp ${TMPDIR}/scratch/iml-gui-*.tgz ${TMPDIR}/_topdir/SOURCES/iml-gui.tgz

	rpmbuild -bs --define "_topdir ${TMPDIR}/_topdir" ${TMPDIR}/scratch/iml-gui.spec

	cp -rf ${TMPDIR}/_topdir ${BUILDROOT}/
	cp -r ${TMPDIR}/_topdir/SRPMS/* $(outdir)
