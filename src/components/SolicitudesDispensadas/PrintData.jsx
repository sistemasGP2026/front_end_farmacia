
import React from 'react';
import { gsUrlApi } from "config/configServer"
import Constancia from './PrintDataIndv';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from '../DemoPrint/Print';
import Icon from '@material-ui/core/Icon';
class PrintData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			abierto: false,
			values: '',
			EstadoForm: true,
			TipoIdentificacion: '',
			Identificacion: '',
			Dv: '',
			rsocial: '',
			regimen: '',
			IdPais: '',
			NombreEspañol: '',
			IdMunicipio: '',
			Direccion: '',
			Celular: '',
			Telefono: '',
			Email: '',
			web: '',
			Estado: '',
			ListaVersiones: [],
			DataEdict: '',
			EstadoAlerta: false,
			idEliminar: '',
			ListSoportes: [],
			ListaProveedores: [],
		};
	}

	 componentDidMount() {
		 if(this.props.data.IdProveedor){
			fetch(gsUrlApi + '/proveedores/_id/' + this.props.data.IdProveedor+ "/", {
				method: 'GET',
				body: JSON.stringify(),
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
					Accept: 'application/json'
				}
			})
				.then(res => res.json())
				.then(data => data)
				.then(data => {
					this.props.data.ObjProveedor = data.datos[0]
					
				})
				.catch(err => console.log('err', err));
		}
	}

	
	imprimirMercancia = data => {};
	handleAfterPrint = () => {};

	handleBeforePrint = () => {};

	handleOnBeforeGetContent2 = () => {
		this.setState({ text: 'Loading new text...', isLoading2: true });

		return new Promise((resolve, any) => {
			setTimeout(() => {
				this.setState({ text: 'New, Updated Text!', isLoading2: false }, resolve);
			}, 2000);
		});
	};

	setComponentRef2 = (ref = ComponentToPrint) => {
		this.componentRef2 = ref;
	};

	reactToPrintContent2 = () => {
		return this.componentRef2;
	};

	reactToPrintTrigger2 = () => {
		return 	<Icon className="text-20">print</Icon>;
	};

	render() {
		return (
			<div>
				<div className="">
					<ReactToPrint
						content={this.reactToPrintContent2}
						documentTitle="Manifiesto"
						onAfterPrint={this.handleAfterPrint}
						onBeforeGetContent={this.handleOnBeforeGetContent2}
						onBeforePrint={this.handleBeforePrint}
						removeAfterPrint
						trigger={this.reactToPrintTrigger2}
					/>
					{this.state.isLoading2 && <p className="indicator">Generando Constancia...</p>}
					<div hidden={true}>
						<Constancia ref={this.setComponentRef2} 
						objDatos={this.props.data} />
					</div>
				</div>
				
			</div>
		);
	}
}

export default PrintData;
