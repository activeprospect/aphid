/**
 * mixin Aphid.Support.Extensions.Vendor.Scriptaculous.Droppables
**/
Aphid.Support.Extensions.Vendor.Scriptaculous.Droppables = {

  isAffected: function(point, element, drop)
  {
    return (
      (drop.element!=element) &&
      ((!drop._containers) ||
        this.isContained(element, drop)) &&
      ((!drop.accept) ||
        (Element.classNames(element).detect( 
          function(v) { return drop.accept.include(v) } ) )) &&
      Position.withinIncludingScrolloffsets(drop.element, point[0], point[1])
    );
  },

  show: function(point, element)
  {
    if (!this.drops.length) return;
    var drop, affected = [];

    this.drops.each( function(drop) {
      if(Droppables.isAffected(point, element, drop))
        affected.push(drop);
    });

    if(affected.length>0)
      drop = Droppables.findDeepestChild(affected);

    if(this.last_active && this.last_active != drop) this.deactivate(this.last_active);
    if (drop) {
      Position.withinIncludingScrolloffsets(drop.element, point[0], point[1]);
      if(drop.onHover)
        drop.onHover(element, drop.element, Position.overlap(drop.overlap, drop.element));

      if (drop != this.last_active) Droppables.activate(drop);
    }
  }

};

Object.extend(Droppables, Aphid.Support.Extensions.Vendor.Scriptaculous.Droppables);
