# Bezier-Spline-From-Lerp

## Lerp Function

The lerp function (Linear Interpolation) takes 3 parameters:
```
lerp(val, p1, p2);
```
- val: A value between 0 and 1 of how far along the curve the point to be drawn is located
- p1: The first anchor point
- p2: The second anchor point

Passing a function like this through a simple loop:
```
for (let i = 0; i < 1; i += .01){
  lerp(i, p1, p2)
}
```
will display 100 points from p1 to p2.

## Quadratic Bezier

The quadratic Bezier curve is a Bezier curve between 3 points, 2 anchor points and 1 control point.
The quadratic function takes in 4 parameters:
```
quadratic(val, p1, p2, p3);
```
- val and p1 remain the same as lerp
- p2: Control point
- p3: Second anchor point

Passing a function like this through a simple loop:
```
for (let i = 0; i < 1; i += .01){
  quadratic(i, p1, p2, p3)
}
```
will display 100 points from p1 to p3 with a curve arching torward p2.

## Cubic Bezier

(This is the main type of Bezier Curve you will see, ex: Adobe Illustrator)

The cubic Bezier curve is a Bezier curve between 4 points, 2 anchor points and 2 control points.
The cubic function takes in 5 parameters:
```
quadratic(val, p1, p2, p3, p4);
```
- val, p1, p2 remain the same as quadratic
- p3: Control point
- p4: Second anchor point

Passing a function like this through a simple loop:
```
for (let i = 0; i < 1; i += .01){
  cubic(i, p1, p2, p3, p4)
}
```
will display 100 points from p1 to p4 with a curve arching torward p2 and p3.

# Higher Dimention Bezier Curves

You might have noticed a pattern with the functions above. Higher level Bezier curves are just nested lerp functions all lerped together:
```
quadratic(val, p1, p2, p3) => lerp(val, 
                                lerp(val, p1, p2), 
                                lerp(val, p2, p3),
                              )
```

and 

```
cubic(val, p1, p2, p3, p4) => lerp(val
                                lerp(val,
                                  lerp(val, p1, p2),
                                  lerp(val, p2, p3) 
                                ),
                                lerp(val, 
                                  lerp(val, p2, p3),
                                  lerp(val, p3, p4)
                                )
                              )
```

Just looking at that is giving me a headache. We can use recursion to simplify these nested lerp's and make a function:
```
spline(val, points);
```
that takes (a value and) a list of N points that we will use to create the N dimentional Bezier curve... here is how.

## Creating our Curve

Lets start with our recursive guard clause:
```
if(points.length == 2){
  return lerp(val, points[0], points[1])
}
```
If we only have 2 points in the recursive pass, we can simply lerp those two points and return the value of the lerp.

Each recurive dig into the splice function can be 2 lists, (points.length - 1) long. Both lists can be passed back into the spline function.
If, once they pass in for the second time, they still have a length > 2, they are sent recursivly through the spline function again, now with 2 sublists. The sublists are built here:
```
let start = points.slice(0, points.length - 1);
let stop = points.slice(1, points.length);
```
Our _start_ list is the first **N**-1 values, and the stop list is the last **N**-1 values. Here is an example:
```
points = [(0, 1), (2, 3), (4, 5)] ## this is just a list of points
```
And Below is what the lists look like after slicing the points list:
```
start = [(0, 1), (2, 3)]
stop = [(2, 3), (4, 5)]
```
We can then:
```
spline(val, start) => x
spline(val, stop)  => y
```
Which we can lerp together x and y, with val, and get a final point for the spline at val.
Remember: Lerp returns a Point. So when we recurse down to the lerp call, we get a point back, which is also what the lerp function takes as a parameter, meaning we can continue to pass points back up the recursive stack, all the way to l.
