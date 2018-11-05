import Vue from 'vue'
import {Component, Prop, Watch, Emit} from 'vue-property-decorator'

@Component
export class goldenContainer extends Vue {
	config: any = {
		content: []
	}
	glObject: any = null
	registerComponent(component/*: Vue|()=>any*/, name?: string): string { throw 'unimplemented'; }
	childPath(comp: Vue): string {
        var childMe = <goldenChild><any>this;
		var rv = childMe.nodePath?`${childMe.nodePath()}.`:'';
		var ndx = this.$children.indexOf(comp);
		console.assert(!!~ndx, 'Children exists');
		return rv+ndx;
	}
	getChild(path: string) {
		var nrs = path.split('.');
		var ndx = nrs.shift();
		var next = this.$children[ndx];
		console.assert(next, "Vue structure correspond to loaded GL configuration");
		return nrs.length ? next.getChild(nrs.join('.')) : next;
	}

	addGlChild(child, comp, index?: number) {
		if(comp && 'component'=== child.type) {
			if(!child.componentName)
				child.componentName = this.registerComponent(comp);
			if(!child.componentState)
				child.componentState = {};
		}
		var ci = this.glObject;
		if(ci)
			ci.addChild(child, index);
		else if(undefined=== index)
			this.config.content.push(child);
		else
			this.config.content.splice(index, 0, child);
	}
	removeGlChild(index: number) {
		var ci = this.glObject;
		if(ci) {
			ci.removeChild(ci.contentItems[index]);
			for(; index< ci.contentItems.length; ++index)
				ci.contentItems[index].index = index;
		} else {
			this.config.content.splice(index, 1);
			for(; index< this.config.content.length; ++index)
				this.config.content[index].index = index;
		}
	}
	get glChildren() {
		return this.glObject.contentItems.map(x=> x.vueObject);
	}
	onGlInitialise(cb: ()=> void): void { throw 'Not implemented'; }
	events: string[] = ['open', 'resize', 'destroy', 'close', 'tab', 'hide', 'show']
}

@Component
export class goldenChild extends Vue {
	@Prop() width: number
	@Prop() height: number
	@Watch('width') reWidth(w) { this.container && this.container.setSize(w, false); }
	@Watch('height') reHeight(h) { this.container && this.container.setSize(false, h); }
	
	@Prop() tabId: string
	glObject: any = null

	get childConfig() { return null; }
	
	container = null;

	hide() { this.container && this.container.hide(); }
	show() { this.container && this.container.show(); }
	@Prop({default: false}) hidden: boolean

	@Watch('container')
	@Watch('hidden')
	setContainer(c) {
		this.container && this.container[this.hidden?'hide':'show']();
	}

	@Prop({default: true}) closable: boolean
	close() {
		this.container && this.container.close();
	}
	$parent: goldenContainer
	created() {
		if(!(this.$parent instanceof goldenContainer))
			throw new Error('gl-component can only appear directly in a golden-layout container');
	}
	nodePath() {
		return this.$parent.childPath(this);
	}

	mounted() {
		var dimensions:any = {};
		if(undefined!== this.width) dimensions.width = this.width;
		if(undefined!== this.height) dimensions.height = this.height;
		this.$parent.addGlChild({
			...dimensions,
			...this.childConfig,
			vue: this.nodePath()
		}, this, this.$parent.$children.indexOf(this));
	}
	beforeDestroy() {
		if(this.glObject)   //It can be destroyed in reaction of the removal of the glObject too
		{
			this.glObject.parent.removeChild(this.glObject);
		}
			
	}
	@Watch('glObject') @Emit() destroy(v) { return !v; }

	events: string[] = ['stateChanged', 'titleChanged', 'activeContentItemChanged', 'itemDestroyed', 'itemCreated',
		'componentCreated', 'rowCreated', 'columnCreated', 'stackCreated', 'destroy', 'destroyed']
}
