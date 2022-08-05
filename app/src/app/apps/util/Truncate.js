import React, { Component } from 'react'

export class Truncate extends Component {

    truncateText() {
        let textTrun = "";
        const prefix = this.props.prefix || ""
        const complement = this.props.complement || "..."
        const size = this.props.size || 10

        if (( textTrun = this.props.text || "").length > size ) {
            textTrun = prefix + textTrun.substring(0,size) + complement;
        }
        return textTrun
    }

    render() {
        return (
            <>
                { this.truncateText() }
            </>
        );
    } 
}

export default Truncate;