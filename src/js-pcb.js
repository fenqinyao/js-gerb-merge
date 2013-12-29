var jspcb = (function() {
    var PCB = function(gerbers) {
        // returns an object representing the PCB
        // gerbers is a list of files that describe the pcb. 
        // example: [ ['board.gtl','<contents of board.gtl>'], ['board.gbl','<contents of board.gbl>'] ]
        var gerbs = gerbers;

        // give some random initial offset to reduce the chances of all the pcbs co-inciding
        this.dx = Math.floor(Math.random()*50);
        this.dy = Math.floor(Math.random()*50);

        // TODO: boundary should be a list of vertices that describes the boundary as in the gerber
        var boundary = [ [0,0] , [0,0] , [0,0] , [0,0] ];

        // TODO: infer the appropriate scale from the gerber
        var scale = 100;

        var xmin = Number.POSITIVE_INFINITY;
        var ymin = Number.POSITIVE_INFINITY;
        var xmax = Number.NEGATIVE_INFINITY;
        var ymax = Number.NEGATIVE_INFINITY;
        var re = /^X(-?\d+)Y(-?\d+)/;
        for(var i=0; i < gerbs.length; i++) {
            var str = gerbs[i][1];
            var lines = str.split('\n');
            for(var j=0; j < lines.length; j++) {
                var m = re.exec(lines[j]);
                if(m) {
                    var x = Number(m[1]);
                    var y = Number(m[2]);
                    if(x < xmin) {
                        xmin = x;
                    }
                    if(x > xmax) {
                        xmax = x;
                    }
                    if(y < ymin) {
                        ymin = y;
                    }
                    if(y > ymax) {
                        ymax = y;
                    }
                }
            }
        }
        boundary = [ [xmin/scale,ymin/scale] , [xmax/scale,ymin/scale], [xmax/scale,ymax/scale], [xmin/scale,ymax/scale] ];
        
        // get it into the display
        if(boundary[0][0] < 0) {
            this.dx += -boundary[0][0];
        }
        if(boundary[0][1] < 0) {
            this.dy += -boundary[0][1];
        }

        var arr = []; // pre-prepping an array for boundary seems to give a small speedup
        for(var i=0;i<boundary.length;i++) {
            arr[i] = [0,0];
        }
        
                
        // TODO: use some heuristic to get PCB name from the gerbers
        this.name = "PCB"+Math.floor(Math.random()*100000).toString(); // random name for PCB

        this.rotation = 0; // this is in degrees

        this.getGerbers = function() {
            // TODO: return list of modified gerbers along with their contents
            return gerbs;
        }
        this.addpcb = function(pcb) {
            // TODO: merge all the PCBs in the argument list and return the merged PCB
            return this;
        }
        this.getBoundary = function() {
            var centre = this.getCentroid();
            // first rotate w.r.t to centroid
            for(var i=0;i < boundary.length; i++) {
                var temp = [boundary[i][0]-centre[0],boundary[i][1]-centre[1]]; // now point is centred at origin
                var rcos = Math.cos(this.rotation * Math.PI / 180);
                var rsin = Math.sin(this.rotation * Math.PI / 180);
                arr[i][0] = centre[0] + (rcos*temp[0] - rsin*temp[1]);
                arr[i][1] = centre[1] + (rsin*temp[0] + rcos*temp[1]);
            }

            // after rotation, translate
            for(var i=0;i < arr.length; i++) {
                arr[i][0] += this.dx;
                arr[i][1] += this.dy;
            }
            return arr;
        }
        this.getCentroid = function() {
            var cx = 0;
            var cy = 0;
            for(var i=0; i < boundary.length; i++) {
                cx += boundary[i][0];
                cy += boundary[i][1];
            }
            return [cx/boundary.length, cy/boundary.length];
        }
        this.getTranslatedCentroid = function() {
            var arr = this.getCentroid();
            arr[0] += this.dx;
            arr[1] += this.dy;
            return arr;
        }
    }

    return {
        PCB: PCB
    }        
}());

