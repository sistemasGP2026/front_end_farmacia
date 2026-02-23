import React from 'react';   
import Constancia from './PrintDataIndv';
import ReactToPrint from 'react-to-print';
import { ComponentToPrint } from '../Imprimir/Print'; 
import Icon from '@material-ui/core/Icon';
class PrintData extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			isLoading2: false
		};
	}

	 componentDidMount() {
		 
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
		console.log("this.props.data", this.props.data);
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
