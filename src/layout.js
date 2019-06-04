//@flow
/*
 * use d3-3d lib to layout the nodes in a 3d space
 */
import * as d3 from 'd3-force-3d'

export function layout(
	nodes : any,
	links		: any,
	//true: the force start and trigger tick event, if false, run all ticks 
	//at a time
	isAnimated		: boolean,
	linkDistance		: number,
	strengthPushAllAway		: number,
	strengthPullToX		: number,
	strengthPullToY		: number,
	strengthPullToZ		: number,
	strengthToBounceOtherAway		: number,
){
	const force		= d3.forceSimulation(nodes, 3)
			.force('charge', 
				d3.forceManyBody()
					.strength(strengthPushAllAway)
			)
//			.force('center', d3.forceCenter())
			.force('x', d3.forceX().strength(strengthPullToX))
			.force('y', d3.forceY().strength(strengthPullToY))
			.force('z', d3.forceZ().strength(strengthPullToZ))
			.force('collision', d3.forceCollide(function(d){
				return (linkDistance * strengthToBounceOtherAway) * (d.weight/10) 
			}))
			.force('link', 
				d3.forceLink(links)
					.distance(linkDistance)
			)
			.stop()
	if(isAnimated){
		//start manually
		//force.restart()
	}else{
		force.tick(200)
	}
	return force
}

/*
 * Given json data, return nodes, links
 */
export function build(
	dataJSON		: any
){
	const nodes		= []
	const links		= []
	function goThrough(data : any, parent : any, level : number){
		data.forEach((node : any) => {
			const newNode		= {
				index		: nodes.length,
				name		: node.name,
				weight		: node.weight,
				level		: level,
			}
			nodes.push(newNode)
			//link
			if(parent){
				links.push({
					index		: links.length,
					source		: parent.index,
					target		: newNode.index,
				})
			}
			if(node.children){
				goThrough(node.children, newNode, level + 1)
			}
		})
	}
	goThrough(dataJSON, undefined, 0)
	return {nodes, links}
}
