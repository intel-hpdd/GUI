srpm: 
	dnf install -y git
	curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
	rm -rf /tmp/_topdir
	rm -rf /tmp/scratch
	mkdir -p /tmp/_topdir/SOURCES
	mkdir -p /tmp/scratch
	cp -r source iml-gui.spec *.js *.json index.ejs /tmp/scratch
	bash -c 'source /root/.bashrc && nvm install 8 && cd /tmp/scratch && npm i && npm run postversion && npm pack'
	cp /tmp/scratch/iml-gui-*.tgz /tmp/_topdir/SOURCES/iml-gui.tgz

	rpmbuild -bs --define "_topdir /tmp/_topdir" /tmp/scratch/iml-gui.spec

	cp -r /tmp/_topdir/SRPMS/* $(outdir)