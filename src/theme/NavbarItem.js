import React from 'react';
import OriginalNavBarItem from '@theme-original/NavbarItem';
import { useLocation }  from '@docusaurus/router';

export default function NavbarItem(props) {
    const { docId, type, ...rest } = props
    const { pathname } = useLocation()
    if (type === 'doc'){
        if (pathname.search("archives/version-2022.3") != -1){
            const to = 'archives/version-2022.3/' + docId.split('/')[0]
            return (
                <>
                    <OriginalNavBarItem {...rest} to={to} /> 
                </>
            )
        } else if(pathname.search("archives/version-2022.4") != -1){
            const to = 'archives/version-2022.4/' + docId.split('/')[0]
            return (
                <>
                    <OriginalNavBarItem {...rest} to={to} /> 
                </>
            )           
        } else if(pathname.search("archives/version-2023.1") != -1){
            const to = 'archives/version-2023.1/' + docId.split('/')[0]
            return (
                <>
                    <OriginalNavBarItem {...rest} to={to} /> 
                </>
            )           
        } else if(pathname.search("archives/version-OCT 23") != -1){
            const to = 'archives/version-OCT 23/' + docId.split('/')[0]
            return (
                <>
                    <OriginalNavBarItem {...rest} to={to} /> 
                </>
            )           
        }
    }

    return (
    <>
        <OriginalNavBarItem {...props} /> 
    </>
    );
}