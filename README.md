# NOTICE: THIS PROJECT HAS BEEN DISCONTINUED AND IS NO LONGER BEING MAINTAINED.
This project is no longer being maintained, and no further updates will be made to it. The project and its code will remain as a historical artifact.

# vcenter-electron

## Welcome!

In moving to VMware vSphere 6 and 6.5, VMware abandoned their C# thick client and instead a web client. This leaves admins in the position where they need to keep track of the vSphere client in a sea of browser tabs. This project was created to address this shortcoming. Basically, the project is an electron front-end for the vSphere client and works like a standalone desktop app.

## Building the Project

To build the project, you will need Node.js and NPM installed on your machine. Clone the repo locally, and then run `npm install` from the repo directory. This will download and install all of the Node.js modules required for the project. 

If you would like a quick select list of all of your vCenters and ESXi hosts, make the appropriate changes in the `mainmenu.js` file. There is a sample vCenter entry and some sample host entries to get you started. If you don't want anything in the menu, feel free to delete everything between the `Begin Custom Menu` and `End Custom Menu` comments.

To run the application to test any changes you make to the menu structure, run `npm start` in the repo directory.

To build an executable, run `npm run build`. Executables will be created in the `dist` directory under the repo root. This directory is specified in the `.gitignore` file so that packaged builds won't be commited to the repo.

Please note that the Windows packager creates a 64-bit executable and won't run on Windows 32-bit.

If you are using Active Directory Integration with your vSphere environment, you'll want to make sure that you install the [Enhanced Authentication Plugin](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vcenter.install.doc/GUID-E640124B-BB55-4D29-AADD-296E01CF88C8.html) from VMware. If Windows Session Authentication already works for you on the vSphere web clients, you most likely already have this installed.

## Contributions
Code contributions are welcome! If there is something you see that can be fixed/improved, feel free to create pull requests for your changes. 


## License

This project is licensed under the [MIT](LICENSE.md). You are free to use this project in any way you wish. Commits back to this repo with fixes and improvements are welcome. The author of the project grants no warranties and accepts no liablity for anything that might result from the use of this software. 
