/**
 * @file TextBG.js
 * @author James Bennion-Pedley
 * @brief ES6 port of TextBG
 * @date 23/07/2022
 *
 * @copyright Copyright (c) 2022
 *
 */

/*---------------------------------- Imports ---------------------------------*/

import React from 'react';

/*------------------------------ Primary Class -------------------------------*/

class TheGraphTextBG extends React.Component {
    displayName = 'TheGraphTextBG';

    render() {
        let { text } = this.props;
        if (!text) {
            text = '';
        }
        const { height } = this.props;
        const width = (text.length * this.props.height * 2) / 3;
        const radius = this.props.height / 2;

        let { x } = this.props;
        const y = this.props.y - height / 2;

        if (this.props.halign === 'center') {
            x -= width / 2;
        }
        if (this.props.halign === 'right') {
            x -= width;
        }

        return React.createElement(
            'g',
            {
                className: (this.props.className ? this.props.className : 'text-bg'),
            },
            React.createElement('rect', {
                className: 'text-bg-rect',
                x,
                y,
                rx: radius,
                ry: radius,
                height: height * 1.1,
                width,
            }),
            React.createElement('text', {
                className: (this.props.textClassName ? this.props.textClassName : 'text-bg-text'),
                x: this.props.x,
                y: this.props.y,
                children: text,
            }),
        );
    }
}

/*----------------------------------------------------------------------------*/

export default React.createElement.bind(null, TheGraphTextBG);
