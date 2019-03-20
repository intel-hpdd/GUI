%define base_name gui
%define managerdir /iml-manager/
%define backcompatdir /usr/lib%{managerdir}

Name:       iml-%{base_name}
Version:    6.5.0
# Release Start
Release:    1%{?dist}
# Release End
Summary:    Graphical User Interface for Integrated Manager for Lustre.
License:    MIT
Group:      System Environment/Libraries
URL:        https://github.com/whamcloud/%{base_name}
Source0:    iml-gui.tgz

BuildArch:  noarch

%description
This module is a bundled version of the realtime user interface for Integrated Manager for Lustre.

%prep
%setup -q -n package

%build
#nothing to do

%install
rm -rf %{buildroot}

mkdir -p %{buildroot}%{_datadir}%{managerdir}%{name}
cp -al targetdir/. %{buildroot}%{_datadir}%{managerdir}%{name}
mkdir -p %{buildroot}%{backcompatdir}
ln -s %{_datadir}%{managerdir}%{name} %{buildroot}%{backcompatdir}%{name}

%clean
rm -rf %{buildroot}

%files
%{_datadir}
%{backcompatdir}

%changelog
* Thu Feb 28 2019 Joe Grund <jgrund@whamcloud.com> - 6.4.2-1
- Update propagateChange to unwrap any seamless-immutable objects it receives

* Thu Oct 25 2018 Will Johnson <wjohnson@whamcloud.com> - 6.4.1-1
- Upgrade inferno, flow, and other deps

* Thu Jun 28 2018 Will Johnson <wjohnson@whamcloud.com> - 6.4.0-1
- Make time configurable on status page

* Wed Jun 20 2018 Will Johnson <wjohnson@whamcloud.com> - 6.3.1-1
- Changed logos from Intel to Whamcloud
- Removed Intel branding (except copyright)

* Thu Mar 15 2018 Brian J. Murrell <brian.murrell@intel.com> - 6.3.0-1
- Build using the module-tools framework
- Move content to /usr/share and create a backcompat symlink
  to be removed at some future update

* Mon Oct 23 2017 Joe Grund <joe.grund@intel.com> - 6.2.5-1
- Bump LNets to 50
- Fix error message working

* Thu Oct 05 2017 Will Johnson <william.c.johnson@intel.com> - 6.2.4-1
- Fix broken "files used" section on dashboard

* Tue Oct 03 2017 Will Johnson <william.c.johnson@intel.com> - 6.2.3-1
- Fix broken help links

* Fri Sep 15 2017 Will Johnson <william.c.johnson@intel.com> - 6.2.2-1
- Fix font issue

* Wed Sep 13 2017 Will Johnson <william.c.johnson@intel.com> - 6.2.1-1
- Fix zombie streams

* Thu Aug 17 2017 Will Johnson <william.c.johnson@intel.com> - 6.2.0-1
- Remove eula (#71)
- Inline templates (#76)
- Fix dispatch source usage with ALLOW_ANONYMOUS_READ (#74)
- Fix popover on server status package (#70)
- Integrate online help (#65)
- Fix chart issues (#66)
- Fix archive number (#68)
- Rewrite storage plugin (#29)
- Fix setImmediate text in address bar (#69)
- Implement chart components (#63)

* Fri Aug 04 2017 Will Johnson <william.c.johnson@intel.com> - 6.1.0-1
- Integrate srcmap-reverse

* Wed Jun 14 2017 Joe Grund <joe.grund@intel.com> - 6.0.13-1
- initial package
