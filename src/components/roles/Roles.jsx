// import React, { Fragment } from "react";
// import Radium from "radium";
// import { gsUrlApi } from '../../config/configServer';
// let glstPermisos = null;


// class CargarMenu extends React.Component {
  
//   constructor(props){
//     super(props);
//     this.state = {
//       mini: '',
//       drawerWidth: '',
//       miniDrawerWidth: '',
//       onMouseEnter: '',
//       onMouseLeave: '',
//       sidebarTheme: '',
//       layoutTheme: '',
//       closeDrawer: '',
//       themeSetting: '',
//       SidebarData: []
//     }
//   }
// }



// // ------------------------
// import React from 'react';
// import CheckboxTree from 'react-checkbox-tree';

// const nodes = [{
//     value: 'mars',
//     label: 'Mars',
//     children: [
//         { value: 'phobos', label: 'Phobos' },
//         { value: 'deimos', label: 'Deimos' },
//     ],
// }];

// class Widget extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             checked: [],
//             expanded: [],
//             nodes: []
//         };
//     }
//     async componentDidMount() {
    
//         fetch(gsUrlApi + '/interfaces/', {
//           method: 'GET',
//           body: JSON.stringify(),
//           headers: {
//               'Content-Type': 'application/json; charset=UTF-8',
//               'Accept': 'application/json',
//           }
//         }) . then(res => res.json())
//             .then(data =>data)
//             .then((data) =>{
//               if (data.interfaces !== null && data.interfaces) {
  
//                   lstData = data.interfaces;
  
//                   if (glstPermisos !== null) {
  
//                       for (let i = 0; i < lstData.length; i++) {
  
//                           lstData[i].state = {
//                               opened: true
//                               , selected: (glstPermisos.indexOf(lstData[i].id) !== -1)
//                           };
  
//                       }
  
//                   } else {
  
//                       for (let i = 0; i < lstData.length; i++) {
  
//                           lstData[i].state = {
//                               opened: true
//                           };
  
//                       }
  
//                   }
  
//                   inicializarTreePermisos(lstData);
  
//               }
  
//                 this.setState(state => ({
//                     ...state,SidebarData: array
//                 }))
//               // return array;
              
//             })
//         .catch(err => console.log("err", err));
        
//     }
//     render() {
//         return (
//             <CheckboxTree
//                 nodes={nodes}
//                 checked={this.state.checked}
//                 expanded={this.state.expanded}
//                 onCheck={checked => this.setState({ checked })}
//                 onExpand={expanded => this.setState({ expanded })}
//             />
//         );
//     }
// }
// export default Radium(CargarMenu);