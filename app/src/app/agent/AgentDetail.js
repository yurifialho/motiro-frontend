import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Form, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap';
import AgentService from '../apps/services/AgentService';
import AgentTypeService from '../apps/services/AgentTypeService';
import AgentSpecialtyService from '../apps/services/AgentSpecialtyService';
import DesireService from '../apps/services/DesireService';
import cogoToast from 'cogo-toast';

export class AgentDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            agent: {
                specialties: [],
                desires: []
            },
            isEdit: false,
            agentTypes: [],
            listSpecialties: [],
            specialtySelected: {},
            listDesires: [],
            desireSelected: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSpecialtiesSelect = this.handleSpecialtiesSelect.bind(this);
        this.handleDesiresSelect = this.handleDesiresSelect.bind(this);
        this.addSpecialty = this.addSpecialty.bind(this);
        this.addDesire = this.addDesire.bind(this);
        this.unlinkDesire = this.unlinkDesire.bind(this);
        this.unlinkSpecialty = this.unlinkSpecialty.bind(this);
    }

    componentDidMount() {
        let id = (this.state.agent.id || this.props.match.params.id )
        if (id === 0) {
            this.setState({isEdit: false})
        } else {
            this.setState({isEdit: true})
            this.loadAgent(id);
        }
        this.loadAgentTypes();
        this.loadAgentSpecialties();
        this.loadDesires()
    }

    async loadAgent(id){
        try {
            let ret = await AgentService.getOne(id);
            if ( ret.status === 200 ) {
                let spec = ret.data.specialties;
                let desi = ret.data.desires;
                let agent = {
                    id: ret.data.id,
                    name: ret.data.name,
                    type: ret.data.type,
                    specialties: [],
                    desires: []
                }
                for(let i=0; i < spec.length; i++){
                    let sret = await AgentSpecialtyService.getOne(spec[i]);
                    if ( sret.status === 200 ){
                        agent.specialties.push(sret.data)
                    }
                }
                for(let i=0; i < desi.length; i++){
                    let dret = await DesireService.getOne(desi[i]);
                    if ( dret.status === 200 ){
                        agent.desires.push(dret.data)
                    }
                }
                console.log(agent);
                this.setState({agent: agent});
            } else { 
                cogoToast.error("Could not to get data.");    
            }
        } catch(error) {
            console.error(error);
            cogoToast.error("Could not to get data.");
        }
    }

    async save() {
        try {
            let agent = this.state.agent;
            let ret = null;
            let sAgent = {
                name: agent.name,
                type: agent.type,
                specialties: [],
                desires: []
            }
            agent.specialties.map( s => (
                sAgent.specialties.push(s.id)
            ));
            agent.desires.map( d => (
                sAgent.desires.push(d.id)
            ));
            if (agent.id) {
                sAgent.id = agent.id;
                ret = await AgentService.edit(agent.id, sAgent);
            } else {
                ret = await AgentService.create(sAgent);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                let id = (this.state.agent.id || this.props.match.params.id )
                this.loadAgent(id);
                cogoToast.success("Agent saved")
            }
            
         } catch(error) {
            console.error(error)
            cogoToast.error("Cannot create agent");
        }
    }

    async loadAgentTypes() {
        try{
            let ret = await AgentTypeService.list();
            if ( ret.status === 200 ) {
                this.setState({ agentTypes: ret.data});
            } else {
                cogoToast.error("Could not to get Agent Type List.");
            }
        } catch (error) {
            console.error(error);
            cogoToast.error("Could not to get Agent Type List.");
        }
    }

    async loadAgentSpecialties() {
        try{
            let ret = await AgentSpecialtyService.list();
            if ( ret.status === 200 ) {
                this.setState({ listSpecialties: ret.data});
            } else {
                cogoToast.error("Could not to get Agent Specialties List.");
            }
        } catch (error) {
            console.error(error);
            cogoToast.error("Could not to get Agent Specialties List.");
        }
    }

    async loadDesires() {
        try{
            let ret = await DesireService.list();
            if ( ret.status === 200 ) {
                this.setState({ listDesires: ret.data});
            } else {
                cogoToast.error("Could not to get Desires List.");
            }
        } catch (error) {
            console.error(error);
            cogoToast.error("Could not to get Desires List.");
        }
    }

    handleChange(event) {
        const obj = event.target;
        switch (obj.id) {
            case 'agentNameInput': {
                let agent = this.state.agent;
                agent.name = obj.value;
                this.setState({agentType: agent});
                break;
            }
            case 'agentTypeSelect': {
                let agent = this.state.agent;
                agent.type = obj.value;
                this.setState({agentType: agent});
                break;
            }
            case 'specialtyName': {
                let spec = {
                    name: obj.value
                }                
                this.setState({specialtySelected: spec});
                break;
            }
            case 'desireName':  {
                let desi = {
                    name: obj.value
                }                
                this.setState({desireSelected: desi});
                break;
            }
            default:
                break;
        }
    }

    handleSpecialtiesSelect(eventKey, event) {
        this.setState({specialtySelected: this.state.listSpecialties[eventKey]});
    }

    handleDesiresSelect(eventKey, event) {
        this.setState({desireSelected: this.state.listDesires[eventKey]});
    }

    async addSpecialty() {
        let agentSpecialty = this.state.specialtySelected;
        try {
            if (!agentSpecialty.id) {
                let ret = await AgentSpecialtyService.create(agentSpecialty);
                if (ret.status === 200 ||  ret.status === 201) {
                    cogoToast.success("Agent Specialty saved")
                    agentSpecialty = ret.data;
                    this.loadAgentSpecialties();
                 } else {
                    cogoToast.error("Cannot create agent type");
                }   
            }

            let agent = this.state.agent;
            agent.specialties.push(agentSpecialty);
            this.setState({agent: agent, specialtySelected: {} });            
            cogoToast.warn("Specialty Linked, but you need save after to persist!");

         } catch(error) {
            console.log(error)
            cogoToast.error("Cannot create agent type");
        }
    }

    async addDesire() {
        let agentDesire = this.state.desireSelected;
        try {
            if (!agentDesire.id) {
                let ret = await DesireService.create(agentDesire);
                if (ret.status === 200 ||  ret.status === 201) {
                    cogoToast.success("Desire saved")
                    agentDesire = ret.data;
                    this.loadDesires();
                 } else {
                    cogoToast.error("Cannot create desire");
                }   
            }

            let agent = this.state.agent;
            agent.desires.push(agentDesire);
            this.setState({agent: agent, desireSelected: {} });            
            cogoToast.warn("Desire Linked, but you need save after to persist!");

         } catch(error) {
            console.log(error)
            cogoToast.error("Cannot create desire");
        }
    }

    unlinkDesire(index) {
        let desires = this.state.agent.desires;
        desires.splice(index, 1);
        let agent = this.state.agent;
        agent.desires = desires
        this.setState({agent: agent})
        cogoToast.warn("Desire Unlinked, but you need save after to persist!");
    }

    unlinkSpecialty(index) {
        let specialties = this.state.agent.specialties;
        specialties.splice(index, 1);
        let agent = this.state.agent;
        agent.specialties = specialties
        this.setState({agent: agent})
        cogoToast.warn("Specialty Unlinked, but you need save after to persist!");
    }

    async deleteSpecialty(index) {
        if(window.confirm("Are you sure?")){
            try {
                let spec = this.state.agent.specialties[index];
                let ret = await AgentSpecialtyService.delete(spec.id);
                
                if (ret.status === 204) {
                  cogoToast.success("Agent Specialty Deleted");
                  this.unlinkSpecialty(index);
                  this.loadAgentSpecialties();
                } else {
                  cogoToast.error("Cannot exclude");
                }
              } catch(error) {
                console.log(error)
                cogoToast.error("Cannot exclude");
              }
        }
    }

    async deleteDesire(index) {
        if(window.confirm("Are you sure?")){
            try {
                let spec = this.state.agent.desires[index];
                let ret = await DesireService.delete(spec.id);
                
                if (ret.status === 204) {
                  cogoToast.success("Desire Deleted");
                  this.unlinkDesire(index);
                  this.loadDesires();
                } else {
                  cogoToast.error("Cannot exclude");
                }
              } catch(error) {
                console.log(error)
                cogoToast.error("Cannot exclude");
              }
        }
    }

    render() {
        return (
            <div>
            <div className="page-header">
                <h3 className="page-title"> { this.state.isEdit ? "Edit" : "New" } Agent  </h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item" aria-current="page"><Link to="/agents">Agents</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">  { this.state.isEdit ? "Edit" : "New" } Agent</li>
                    </ol>
                </nav>
            </div>
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                    <div className="d-flex flex-row justify-content-between">
                        <div className="justify-content-between">
                            <h4 className="card-title"> { this.state.agent.name } Agent</h4>
                        </div>
                        <div className="justify-content-between">
                            <Link to='/agents'>
                            <button type="button" className="btn btn-danger" >
                                <i className="mdi mdi-window-close"></i>
                                Cancel
                            </button>
                            </Link>
                            <button type="button" className="btn btn-success" onClick={ () => { this.save() }}>
                                <i className="mdi mdi-content-save"></i>
                                Save
                            </button>
                        </div>
                    </div>
                    <div>
                        <Form onSubmit={ event => event.preventDefault() }>
                            <Form.Group>
                                <label htmlFor="agentNameInput">Name</label>
                                <Form.Control type="text" id="agentNameInput" placeholder="Agent Type Name" value={this.state.agent.name || ''} onChange={this.handleChange} required />
                            </Form.Group>
                            <Form.Group>
                                <label htmlFor="agentTypeSelect">Type</label>
                                <select className="form-control" id="agentTypeSelect" required value={ this.state.agent.type || '' } onChange={this.handleChange} >
                                    <option value=""></option>
                                    { this.state.agentTypes.map(type => (
                                        <option key={ "agenttype-opt-"+type.id } value={type.id} >{type.name}</option>
                                    ))}
                                </select>
                            </Form.Group>
                        </Form>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-4 grid-margin stretch-card">
                <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Agent Details</h4>
                    <div className="table-responsive">
                    </div>
                </div>
                </div>
                </div>

                <div className="col-lg-4 grid-margin stretch-card">
                <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Desire/Intention</h4>
                    <Form onSubmit={ event => event.preventDefault() }>
                        <InputGroup>
                            <DropdownButton variant='success' title="Desires" as={InputGroup.Prepend}>
                                { this.state.listDesires.map( (spec, index) => (
                                    <Dropdown.Item 
                                        key={"dropitem-desire-key-id"+index}
                                        disabled={ this.state.agent.desires.some( item => item.id === spec.id )}
                                        eventKey={index}
                                        onSelect={ this.handleDesiresSelect }
                                        onSubmit={ event => event.preventDefault() }>
                                        <i className={  this.state.agent.desires.some( item => item.id === spec.id ) ? "mdi mdi-window-close" : "mdi mdi-check" }>
                                            {spec.name} 
                                        </i>
                                        
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                            <Form.Control  id='desireName' name='desireName' type="text" className="form-control" 
                                    placeholder="Desire Name" aria-label="Desire Name" 
                                    aria-describedby="basic-addon2" value={ this.state.desireSelected.name || '' }
                                    onChange={ this.handleChange } />
                            <InputGroup.Append>
                                <button className="btn btn-sm btn-success" type="button" onClick={ () => this.addDesire() }>+</button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                    <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        { this.state.agent.desires.map( (s, index) => (
                            <tr key={"desire-id-"+s.id}>
                                <td>{s.id}</td>
                                <td>{s.name}</td>
                                <td>
                                    <div className="btn-group" role="group" aria-label="bt-group-desire">
                                    <button type="button" className="btn btn-warning btn-sm" onClick={ () => this.unlinkDesire(index) }>
                                        <i className="mdi mdi-link-off"></i>
                                    </button>
                                    <button type="button" className="btn btn-danger btn-sm" onClick={ () => this.deleteDesire(index)}>
                                        <i className="mdi mdi-delete-forever"></i>
                                    </button>
                                    </div>
                                </td>
                            </tr>
                         ))}  
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
                </div>


                <div className="col-lg-4 grid-margin stretch-card">
                <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Specialties</h4>
                    <Form onSubmit={ event => event.preventDefault() }>
                        <InputGroup>
                            <DropdownButton variant='success' title="Specialties" as={InputGroup.Prepend}>
                                { this.state.listSpecialties.map( (spec, index) => (
                                    <Dropdown.Item 
                                        key={"dropitem-spec-key-id"+index}
                                        disabled={ this.state.agent.specialties.some( item => item.id === spec.id )}
                                        eventKey={index}
                                        onSelect={ this.handleSpecialtiesSelect }
                                        onSubmit={ event => event.preventDefault() }>
                                        <i className={  this.state.agent.specialties.some( item => item.id === spec.id ) ? "mdi mdi-window-close" : "mdi mdi-check" }>
                                            {spec.name} 
                                        </i>
                                        
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                            <Form.Control  id='specialtyName' name='specialtyName' type="text" className="form-control" 
                                    placeholder="Specialty Name" aria-label="Specialty Name" 
                                    aria-describedby="basic-addon2" value={ this.state.specialtySelected.name || '' }
                                    onChange={ this.handleChange } />
                            <InputGroup.Append>
                                <button className="btn btn-sm btn-success" type="button" onClick={ () => this.addSpecialty() }>+</button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                    <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        { this.state.agent.specialties.map( (s, index) => (
                            <tr key={"spec-id-"+s.id}>
                                <td>{s.id}</td>
                                <td>{s.name}</td>
                                <td>
                                    <div className="btn-group" role="group" aria-label="bt-group-specialty">
                                    <button type="button" className="btn btn-warning btn-sm" onClick={ () => this.unlinkSpecialty(index)}>
                                        <i className="mdi mdi-link-off"></i>
                                    </button>
                                    <button type="button" className="btn btn-danger btn-sm" onClick={ () => this.deleteSpecialty(index)}>
                                        <i className="mdi mdi-delete-forever"></i>
                                    </button>
                                    </div>
                                </td>
                            </tr>
                         ))}  
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
                </div>
            </div>
            </div>);
    }
}

export default AgentDetail;