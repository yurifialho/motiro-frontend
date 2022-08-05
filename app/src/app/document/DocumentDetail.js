import React, { Component } from 'react'
import { Form, DropdownButton, Dropdown, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DocumentService from '../apps/services/DocumentService';
import DataObjectService from '../apps/services/DataObjectService';
import AttributeService from '../apps/services/AttributeService';
import Truncate from '../apps/util/Truncate';
import SemanticBadges from '../apps/util/SemanticBadges';
import cogoToast from 'cogo-toast';

export class DocumentDetail extends Component {
    
    constructor(props){
        super(props)
        this.state = {
          obj: {},
          listBadges: [],
          listDataObjects: [],
          listDataObjectsInDocument: [],
          dataObjectName: "",
          dataObjectSelected: {},
          attributeName: "",
          listAttributes: [],
          listAttributesInDocument: [],
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleDataObjectSelect = this.handleDataObjectSelect.bind(this);
        this.handleAttributeSelect = this.handleAttributeSelect.bind(this);
        this.unlinkDataObject = this.unlinkDataObject.bind(this);
        this.unlinkAttribute = this.unlinkAttribute.bind(this);
        this.editDataObject = this.editDataObject.bind(this);
        this.editAttribute = this.editAttribute.bind(this);
    }
    
    componentDidMount(){
        try {
            
        // this.loadAttributes();
            let id = (this.state.obj.id || this.props.match.params.id )
            if (id) {
                this.load(id);
                this.loadComposition();
            }
        } catch(error) {
            console.error(error);
            cogoToast.error("Could not to get Document.");
        }        
    }

    async load(id){
        try {
            let ret = await DocumentService.getOne(id);
            if (ret.status === 200) {
                let obj = ret.data;
                let badges = await DocumentService.getBadges(id);
                this.setState({obj: obj, listBadges: badges.data});
            } else {
                cogoToast.error("Could not to get Document.");
            }
            await this.loadDataObjects();
            await this.loadAttributes();
        } catch(error) {
          console.error(error);
          cogoToast.error("Could not to get Document.");
        }
    }

    async loadDataObjects(){
        try {
            let ret = await DataObjectService.list()
            if ( ret.status === 200 ) {
                let dataObjects = ret.data;
                this.setState({listDataObjects: dataObjects})
                let dataObjectsInDocument = []
                dataObjects.forEach(dto => {
                    dto.selected = false;
                    this.state.obj.data_objects.forEach(inDto => {
                        if(dto.id === inDto) {
                            dto.selected = true;
                            dataObjectsInDocument.push(dto);
                        }
                    });
                });
                this.setState({listDataObjectsInDocument: dataObjectsInDocument});
            } else {
                cogoToast.error("Could not to get Data Object List.");
            }
        } catch(error) {
          console.error(error)
          cogoToast.error("Could not to get Data Object List.");
        }
    }

    async loadAttributes() {
        try {
            let ret = await AttributeService.list()
            if ( ret.status === 200 ) {
                let attributes = ret.data;
                this.setState({listAttributes: attributes})
                let attInDocument = []
                attributes.forEach(att => {
                    att.selected = false;
                    this.state.obj.attributes.forEach(inAtt => {
                        if(att.id === inAtt) {
                            att.selected = true;
                            attInDocument.push(att);
                        }
                    });
                });
                this.setState({listAttributesInDocument: attInDocument});
            } else {
                cogoToast.error("Could not to get Attributes List.");
            }
        } catch(error) {
            console.error(error)
            cogoToast.error("Could not to get Attributes List.");
        }
    }

    async loadComposition() {
        try {
            /*let ret = await ProcessService.getActivities(processid);
            if ( ret.status === 200 ) {
                let activity = {
                    goal: {},
                    agent: {},
                }
                this.setState({ listActivities: ret.data, 
                                activitySelected: activity, 
                                activityName: ""});
            } else {
                cogoToast.error("Could not to get Process Activities List.");    
            }*/
        } catch(error) {
            console.error(error)
            cogoToast.error("Could not to get Process Activities List.");
        }
        
    }

    async save() {
        try {
            let obj = this.state.obj;
            let ret = null;
            if (obj.id) {
                ret = await DocumentService.edit(obj);
            } else {
                ret = await DocumentService.create(obj);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                this.load(obj.id);
                cogoToast.success("Document saved");
            }
         } catch(error) {
            console.error(error)
            cogoToast.error("Could not to save");
        }
    }

    async saveDataObject() {
        try {
            /*let activity = this.state.activitySelected;
            if ( activity.goal != null && activity.goal.id ) {
                activity.goal = activity.goal.id;
            } else {
                activity.goal = null;
            }
            if ( activity.agent != null && activity.agent.id ) {
                activity.agent = activity.agent.id;
            } else {
                activity.agent = null;
            }

            let ret = null;
            if (activity.id) {
                ret = await ActivityService.edit(activity);
            } else {
                ret = await ActivityService.create(activity);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                this.loadActivities(this.state.process.id);
                cogoToast.success("Process saved");
            }*/
        } catch(error) {
            console.error(error)
            cogoToast.error("Could not to save");
        }
    }

    async saveAttribute() {
        try {
            /*let activity = this.state.activitySelected;
            if ( activity.goal != null && activity.goal.id ) {
                activity.goal = activity.goal.id;
            } else {
                activity.goal = null;
            }
            if ( activity.agent != null && activity.agent.id ) {
                activity.agent = activity.agent.id;
            } else {
                activity.agent = null;
            }

            let ret = null;
            if (activity.id) {
                ret = await ActivityService.edit(activity);
            } else {
                ret = await ActivityService.create(activity);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                this.loadActivities(this.state.process.id);
                cogoToast.success("Process saved");
            }*/
        } catch(error) {
            console.error(error)
            cogoToast.error("Could not to save");
        }
    }

    handleChange(event) {
        const obj = event.target;
        switch (obj.id) {
            case 'objNameInput': {
                let doc = this.state.obj;
                doc.l_name = obj.value;
                this.setState({'obj': doc});
                break;
            }
            case 'objDescriptionInput': {
                let doc = this.state.obj;
                doc.l_description = obj.value;
                this.setState({'obj': doc});
                break;
            }
            case 'objTypeInput': {
                let doc = this.state.obj;
                doc.l_type = obj.value;
                this.setState({'obj': doc});
                break;
            }
            case 'dataObjectName': {
                this.setState({ dataObjectName: obj.value });
                break;
            }
            case 'dataObjectNameInput': {
                let obj = this.state.dataObjectSelected;
                obj.l_name = obj.name;
                this.setState({ dataObjectSelected: obj });
                break;
            }
            case 'dataObjectDescriptionInput': {
                let obj = this.state.dataObjectSelected;
                obj.l_description = obj.value;
                this.setState({ dataObjectSelected: obj });
                break;
            }
            case 'attributeName': {
                this.setState({ attributeName: obj.value });
                break;
            }
            case 'attributeNameInput': {
                let obj = this.state.activitySelected;
                obj.l_name = obj.name;
                this.setState({ activitySelected: obj });
                break;
            }
            case 'attributeValueInput': {
                let obj = this.state.activitySelected;
                obj.l_description = obj.value;
                this.setState({ activitySelected: obj });
                break;
            }
        }
    }

    handleDataObjectSelect(eventKey, event) {
        let dtoSelected = this.state.listDataObjects[eventKey]
        let dataObjectsInDocument = this.state.listDataObjectsInDocument
        if(!dataObjectsInDocument.includes(dtoSelected)){
            let doc = this.state.obj;
            doc.data_objects.push(dtoSelected.id);
            dataObjectsInDocument.push(dtoSelected)
            dtoSelected.selected = true
            console.log(doc);
            this.setState({ obj: doc, 
                            listDataObjectsInDocument: dataObjectsInDocument,
                            listDataObjects: this.state.listDataObjects});
        }        
    }

    handleAttributeSelect(eventKey, event) {
        let attSelected = this.state.listAttributes[eventKey]
        let attInDocument = this.state.listAttributesInDocument
        if(!attInDocument.includes(attSelected)){
            let doc = this.state.obj;
            doc.attributes.push(attSelected.id);
            attInDocument.push(attSelected)
            attSelected.selected = true
            console.log(doc);
            this.setState({ obj: doc, 
                            listAttributesInDocument: attInDocument,
                            listAttributes: this.state.listAttributes});
        }
    }    

    unlinkDataObject(id) {
        let obj = this.state.obj;
            obj.data_objects = []
        let dataObjectsInDocument = []
        this.state.listDataObjectsInDocument.forEach( dto => {
            if(dto.id != id) {
                dataObjectsInDocument.push(dto);
                obj.data_objects.push(dto.id)
            }
        })
        let dataObjects = this.state.listDataObjects;
        dataObjects.forEach(dto => {
            if(dto.id === id) {
                dto.selected = false;
            }
        })
        this.setState({obj: obj, 
                       listDataObjects: dataObjects,
                       listDataObjectsInDocument: dataObjectsInDocument});

        cogoToast.warn("Data Object Unlinked, but you need save after to persist!");
    }

    async addDataObject() {
        try {
            let dataObject = {
                l_name: this.state.dataObjectName
            }
            let ret = await DataObjectService.create(dataObject);
            if (ret.status === 200 || ret.status === 201) {
                this.loadDataObjects()
                cogoToast.success("Data Object saved");
                this.setState({ dataObjectName: "" })
            } else {
                cogoToast.error("Could not to save the data object");
            }
        } catch(error) {
            console.error(error)
            cogoToast.error("Could not to save");
        }
    }

    editDataObject(activity) {
        /*if ( activity.goal == null ) {
            activity.goal = {};
        } else {
            for ( let i=0; i < this.state.listActivityGoals.length; i++) {
                let goal = this.state.listActivityGoals[i];
                if (goal.id === activity.goal) {
                    activity.goal = goal;
                    break;
                }
                
            }
        }
        if ( activity.agent == null ) {
            activity.agent = {};
        } else {
            for ( let i=0; i < this.state.listAgents.length; i++) {
                let agent = this.state.listAgents[i];
                if (agent.id === activity.agent) {
                    activity.agent = agent;
                    break;
                }
                
            }
        }
        this.setState({activitySelected: activity});
        cogoToast.success("Activity loaded.");*/
    }

    async deleteDataObject(id){
        if (window.confirm("Are you sure?")) {
            try {
                let ret = await DataObjectService.delete(id);
                if (ret.status === 204) {
                    this.loadDataObjects()
                    cogoToast.success("Activity deleted");
                } else {
                    cogoToast.error("Could not to delete the activity");
                }
            } catch(error) {
                console.error(error)
                cogoToast.error("Could not to delete the activity");
            }
        }
    }

    unlinkAttribute(id) {
        let obj = this.state.obj;
        obj.attributes = []
        let attributesInDocument = []
        this.state.listAttributesInDocument.forEach( att => {
            if(att.id != id) {
                attributesInDocument.push(att);
                obj.attributes.push(att.id)
            }
        })
        let attributes = this.state.listAttributes;
        attributes.forEach(att => {
            if(att.id === id) {
                att.selected = false;
            }
        })
        this.setState({obj: obj, 
                    listAttributes: attributes,
                    listAttributesInDocument: attributesInDocument});

        cogoToast.warn("Attribute Unlinked, but you need save after to persist!");
    }

    async addAttribute() {
        try {
            let attribute = {
                l_name: this.state.attributeName
            }
            let ret = await AttributeService.create(attribute);
            if (ret.status === 200 || ret.status === 201) {
                this.loadAttributes()
                cogoToast.success("Attribute saved");
                this.setState({ attributeName: "" })
            } else {
                cogoToast.error("Could not to save the attribute");
            }
        } catch(error) {
            console.error(error)
            cogoToast.error("Could not to save");
        }
    }

    editAttribute(activity) {
        /*if ( activity.goal == null ) {
            activity.goal = {};
        } else {
            for ( let i=0; i < this.state.listActivityGoals.length; i++) {
                let goal = this.state.listActivityGoals[i];
                if (goal.id === activity.goal) {
                    activity.goal = goal;
                    break;
                }
                
            }
        }
        if ( activity.agent == null ) {
            activity.agent = {};
        } else {
            for ( let i=0; i < this.state.listAgents.length; i++) {
                let agent = this.state.listAgents[i];
                if (agent.id === activity.agent) {
                    activity.agent = agent;
                    break;
                }
                
            }
        }
        this.setState({activitySelected: activity});
        cogoToast.success("Activity loaded.");*/
    }

    async deleteAttribute(id){
        if (window.confirm("Are you sure?")) {
            try {
                let ret = await AttributeService.delete(id);
                if (ret.status === 204) {
                    this.loadAttributes()
                    cogoToast.success("Attribute deleted");
                } else {
                    cogoToast.error("Could not to delete the Attribute");
                }
            } catch(error) {
                console.error(error)
                cogoToast.error("Could not to delete the Attribute");
            }
        }
    }

    render() {
        return (
        <div>
        <div className="page-header">
            <h3 className="page-title">Document Detail</h3>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item" aria-current="page"><Link to="/know-structure/document">Document</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Document Detail</li>
                </ol>
            </nav>
        </div>
        <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">             
            <div className="card">       
                <div className="card-body">
                    <div className="d-flex flex-row justify-content-between">
                        <div className="justify-content-between">
                            <h4 className="card-title">
                                (<Truncate text={this.state.obj.id} size={8} complement=" " prefix=" "/>)
                                { this.state.obj.l_name }
                            </h4>
                            <SemanticBadges badges={this.state.listBadges} />
                        </div>
                        <div className="justify-content-between">
                            <Link to='/know-structure/document'>
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
                    
                    <Form onSubmit={ event => event.preventDefault() }>
                        <Form.Group>
                            <label htmlFor="objNameInput">Name</label>
                            <Form.Control type="text" id="objNameInput" placeholder="Name" value={this.state.obj.l_name || ''} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="objDescriptionInput">Description</label>
                            <Form.Control as="textarea" id="objDescriptionInput" row={4} value={this.state.obj.l_description || ''} onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="objTypeInput">Type</label>
                            <Form.Control type="text" id="objTypeInput" placeholder="Type" value={this.state.obj.l_type || ''} onChange={this.handleChange}/>
                        </Form.Group>
                    </Form> 
                </div>
            </div>
            </div>
        </div>
        
        <div className="row">
            <div className="col-lg-6 grid-margin stretch-card">
            <div className="card">
            <div className="card-body">
                <h4 className="card-title">Data Object Composition</h4>
                <Form onSubmit={ event => event.preventDefault() }>
                    <InputGroup>
                        <DropdownButton variant='success' title="Data Objects" as={InputGroup.Prepend}>
                            { this.state.listDataObjects.map( (dto, index) => (
                                <Dropdown.Item 
                                    key={"dropitem-activityagent-key-id"+index}
                                    disabled={ (dto.selected) }
                                    eventKey={index}
                                    onSelect={ this.handleDataObjectSelect }
                                    onSubmit={ event => event.preventDefault() }>
                                    <i className={ (dto.selected)  ? "mdi mdi-window-close" : "mdi mdi-check" }>
                                    {dto.l_name} 
                                    </i>                                    
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                        <Form.Control  id='dataObjectName' name='activityName' type="text" className="form-control" 
                                placeholder="Data Object Name" aria-label="Activity Name" 
                                aria-describedby="basic-addon2" value={ this.state.dataObjectName || '' }
                                onChange={ this.handleChange } />
                        <InputGroup.Append>
                            <button className="btn btn-sm btn-success" type="button" onClick={ () => this.addDataObject() }>+</button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
                <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this.state.listDataObjectsInDocument.map( (s, index) => (
                        <tr key={"spec-id-"+s.id}>
                            <td><Truncate text={s.id} size={8} complement=" " prefix=" "/></td>
                            <td>{s.l_name}</td>
                            <td> <SemanticBadges badges={s.badges} /> </td>
                            <td>
                                <div className="btn-group" role="group" aria-label="bt-group-dataobject">
                                    <button type="button" className="btn btn-warning btn-sm" onClick={ () => this.editDataObject(s)}>
                                        <i className="mdi mdi-eye"></i>
                                    </button>
                                    <button type="button" className="btn btn-primary btn-sm" onClick={ () => this.unlinkDataObject(s.id)}>
                                        <i className="mdi mdi-link-off"></i>
                                    </button>                                    
                                    <button type="button" className="btn btn-danger btn-sm" onClick={ () => this.deleteDataObject(s.id)}>
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

            <div className="col-lg-6 grid-margin stretch-card">
            <div className="card">
            <div className="card-body">
                <div className="d-flex flex-row justify-content-between">
                    <div className="justify-content-between">
                    <h4 className="card-title">Data Object Detail { this.state.dataObjectSelected.id ? "(#"+this.state.dataObjectSelected.id+")" : "" }</h4>
                    </div>
                    <div className="justify-content-between">
                        { ( this.state.dataObjectSelected.id ) &&
                        <button type="button" className="btn btn-success" onClick={ () => { this.saveDataObject() }}>
                            <i className="mdi mdi-content-save"></i>
                            Save
                        </button>
                        }
                    </div>
                </div>
                <Form onSubmit={ event => event.preventDefault() }>
                    <Form.Group>
                        <label htmlFor="dataObjectNameInput">Name</label>
                        <Form.Control type="text" id="dataObjectNameInput" placeholder="Activity Name" value={this.state.dataObjectSelected.name || ''} onChange={this.handleChange} required />
                    </Form.Group>
                    <Form.Group>
                        <label htmlFor="dataObjectDescriptionInput">Description</label>
                        <Form.Control as="textarea" id="dataObjectDescriptionInput" row={4} value={this.state.dataObjectSelected.description || ''} onChange={this.handleChange}/>
                    </Form.Group>
                </Form>
            </div>
            </div>
            </div>
        </div>

        <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
            <div className="card-body">
                <h4 className="card-title">Attributes Composition</h4>
                <Form onSubmit={ event => event.preventDefault() }>
                    <InputGroup>
                        <DropdownButton variant='success' title="Attributes" as={InputGroup.Prepend}>
                            { this.state.listAttributes.map( (att, index) => (
                                <Dropdown.Item 
                                    key={"dropitem-activityagent-key-id"+index}
                                    disabled={ (att.selected) }
                                    eventKey={index}
                                    onSelect={ this.handleAttributeSelect }
                                    onSubmit={ event => event.preventDefault() }>
                                    <i className={ (att.selected)  ? "mdi mdi-window-close" : "mdi mdi-check" }>
                                    {att.l_name} 
                                    </i>                                    
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                        <Form.Control  id='attributeName' name='attributeName' type="text" className="form-control" 
                                placeholder="Attribute Name" aria-label="Attribute Name" 
                                aria-describedby="basic-addon2" value={ this.state.attributeName || '' }
                                onChange={ this.handleChange } />
                        <InputGroup.Append>
                            <button className="btn btn-sm btn-success" type="button" onClick={ () => this.addAttribute() }>+</button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
                <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this.state.listAttributesInDocument.map( (s, index) => (
                        <tr key={"spec-id-"+s.id}>
                            <td><Truncate text={s.id} size={8} complement=" " prefix=" "/></td>
                            <td>{s.l_name}</td>
                            <td>{s.l_value}</td>
                            <td> <SemanticBadges badges={s.badges} /> </td>
                            <td>
                                <div className="btn-group" role="group" aria-label="bt-group-attribute">
                                    <button type="button" className="btn btn-warning btn-sm" onClick={ () => this.editAttribute(s)}>
                                        <i className="mdi mdi-eye"></i>
                                    </button>
                                    <button type="button" className="btn btn-primary btn-sm" onClick={ () => this.unlinkAttribute(s.id)}>
                                        <i className="mdi mdi-link-off"></i>
                                    </button>                                    
                                    <button type="button" className="btn btn-danger btn-sm" onClick={ () => this.deleteAttribute(s.id)}>
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

        </div>
        );
    }

}

export default DocumentDetail;