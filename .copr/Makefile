BUILDROOT:=$(shell [ -d "/build" ] && echo "/build" || echo ".")
TMPDIR:=$(shell mktemp -d)

srpm:
	mkdir -p ${TMPDIR}/_topdir/SOURCES
	mkdir -p ${TMPDIR}/scratch
	rm -rf ${BUILDROOT}/_topdir

	cp -r source iml-gui.spec *.js *.json index.ejs ${TMPDIR}/scratch
	cd ${TMPDIR}/scratch && npm ci --only=production && npm run postversion && npm pack
	cp ${TMPDIR}/scratch/iml-gui-*.tgz ${TMPDIR}/_topdir/SOURCES/iml-gui.tgz

	rpmbuild -bs --define "_topdir ${TMPDIR}/_topdir" ${TMPDIR}/scratch/iml-gui.spec

	cp -rf ${TMPDIR}/_topdir ${BUILDROOT}/
	cp -r ${TMPDIR}/_topdir/SRPMS/* $(outdir)
