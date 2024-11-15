import { CodeLabel, CodeSection } from '../../documentationBase';
import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function ModalDemo({ children, color }) {

    const isBrowser = useIsBrowser();

    if (isBrowser) {
        const RapidImports = require('../../rapidImports');
        RapidImports.registerComponents();
    }

    const modalRef = useRef(null);
    const modalRefSlotTop = useRef(null);
    const modalRefSlotBottom = useRef(null);
    const modalRefLeft = useRef(null);
    const modalRefRight = useRef(null);

    const [showCallbackMessage, setShowCallbackMessage] = useState('');
    const [closeCallbackMessage, setCloseCallbackMessage] = useState('');
    const showCallback = (message) => {
        setShowCallbackMessage(message);
    }

    const closeCallback = (message) => {
        setCloseCallbackMessage(message);
    }

    const handleClick = (ref) => {
        if (ref.current) {
            ref.current.show();
        }
    };

    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.onShowCallback = () => showCallback('modal shown');
            modalRef.current.onCloseCallback = () => closeCallback('modal closed');
        }

        if (modalRefSlotTop.current) {
            modalRefSlotTop.current.onShowCallback = () => showCallback('top slot modal shown');
            modalRefSlotTop.current.onCloseCallback = () => closeCallback('top slot modal closed');
        }

        if (modalRefSlotBottom.current) {
            modalRefSlotBottom.current.onShowCallback = () => showCallback('bottom slot modal shown');
            modalRefSlotBottom.current.onCloseCallback = () => closeCallback('bottom slot modal closed');
        }

        if (modalRefLeft.current) {
            modalRefLeft.current.onShowCallback = () => showCallback('left modal shown');
            modalRefLeft.current.onCloseCallback = () => closeCallback('left modal closed');
        }

        if (modalRefRight.current) {
            modalRefRight.current.onShowCallback = () => showCallback('right modal shown');
            modalRefRight.current.onCloseCallback = () => closeCallback('right modal closed');
        }
    }, []);


    return (<CodeSection><CodeLabel>Modal:</CodeLabel>
        <div style={{ color: 'var(--neutral-foreground-rest)'}}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <rapid-button
                    onClick={() => handleClick(modalRef)}>
                    Open modal
                </rapid-button>
                <rapid-button onClick={() => handleClick(modalRefSlotTop)}>Open modal with top slot</rapid-button>
                <rapid-button onClick={() => handleClick(modalRefSlotBottom)}>Open modal with bottom slot</rapid-button>
                <rapid-button onClick={() => handleClick(modalRefLeft)}>Open modal positioned left</rapid-button>
                <rapid-button onClick={() => handleClick(modalRefRight)}>Open modal positioned right</rapid-button>
            </div>
            <div>
                <div>
                    <label>On show callback: {showCallbackMessage}</label>
                </div>
                <div>
                    <label>On close callback: {closeCallbackMessage}</label>
                </div>
            </div>
            <rapid-modal
                ref={modalRef}
            >
                Modal example
            </rapid-modal>
            <rapid-modal
                ref={modalRefSlotTop}
            >
                <h3 slot="top">Top slot</h3>
                Modal example with top slot
            </rapid-modal>
            <rapid-modal
                ref={modalRefSlotBottom}
            >
                Modal example with bottom slot
                <div slot="bottom">
                    <i>Slotted content in the bottom</i>
                </div>
            </rapid-modal>
            <rapid-modal
                ref={modalRefLeft}
                position="left">
                <p>This is a modal. It is positioned to the left.</p>
            </rapid-modal>
            <rapid-modal
                ref={modalRefRight}
                position="right">
                <p>This is a modal. It is positioned to the right.</p>
            </rapid-modal>
        </div>
    </CodeSection >)
}
