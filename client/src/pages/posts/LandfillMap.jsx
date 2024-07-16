import React from 'react'
import AuthorFooter from '../../components/AuthorFooter'
import Menu from '../../components/Menu'

const LandfillMap = () => {
    const headerImageUrl = 'https://picsum.photos/300/200'
    const authorImageUrl = 'https://picsum.photos/200/300'
    return (
        <div className='single'>
            <div className='content'>
                <img src={headerImageUrl}></img>
                <AuthorFooter authorImageUrl={authorImageUrl} postDate='July 15, 2024' authorName='Mattie' />
                <p>content content content</p>
                <div class="embed-container">
                <small><a href="//destinyjade.maps.arcgis.com/apps/Embed/index.html?webmap=f4e1855688434760a8f7e688f3aa72db&extent=-122.5477,37.3013,-121.6695,37.7722&zoom=true&scale=true&details=true&legendlayers=true&active_panel=details&disable_scroll=false&theme=light" target="_blank">View larger map</a></small><br/><iframe width="500" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" title="Landfill_Test" src="//destinyjade.maps.arcgis.com/apps/Embed/index.html?webmap=f4e1855688434760a8f7e688f3aa72db&extent=-122.5477,37.3013,-121.6695,37.7722&zoom=true&previewImage=false&scale=true&details=true&legendlayers=true&active_panel=details&disable_scroll=false&theme=light"></iframe>
                </div>
            </div>
            <Menu />
        </div>
    )
}
export default LandfillMap