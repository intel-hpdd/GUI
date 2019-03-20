srpm: 
	dnf install -y npm git
	rm -rf /tmp/_topdir
	rm -rf /tmp/scratch
	mkdir -p /tmp/_topdir/SOURCES
	mkdir -p /tmp/scratch
	cp -r source iml-gui.spec *.js *.json index.ejs /tmp/scratch
	cd /tmp/scratch; \
	npm i; \
	npm run postversion; \
	npm pack; \
	cp iml-gui-*.tgz /tmp/_topdir/SOURCES/iml-gui.tgz

	rpmbuild -bs --define "_topdir /tmp/_topdir" /tmp/scratch/iml-gui.spec

	cp -r /tmp/_topdir/SRPMS/* $(outdir)