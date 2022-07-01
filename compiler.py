# Compiler

# Compile all the model data into JSON files that can be plugged into the website.

import os
import sys
import json
os.chdir('/Users/michaelgoff/Desktop/Urban Cruise Ship/Energy Model')
#sys.path.append(os.path.abspath("/Users/michaelgoff/Desktop/Urban Cruise Ship/Energy Model/Modules"))

# Run some individual models
#import ghg_by_source
#reload (ghg_by_source)

with open("/Users/michaelgoff/Desktop/Urban Cruise Ship/Energy Model/Model/references.json") as json_file:
    references_master = json.load(json_file)

solutions_count = 0

solution_counter = {"total":0}
# The format for metrics is {"metric_name":{"total":number, "num_solutions":number}}
metrics = {}
    
def compile_solution(solution,topic,name="",sitename=""):
    global solutions_count
    with open("/Users/michaelgoff/Desktop/Urban Cruise Ship/Energy Model/Model/"+solution+".json") as json_file2:
        if name=="":
            name = topic["solutions"][j]["name"]
        sections = json.load(json_file2)
        solution_data_ind = {"sections":sections, "title":name, "parent_link":topic["url"], "parent_name":topic["name"]}
        solution_data_ind["references"] = []
        # Fill in references
        for k in range(len(sections)):
            for l in range(len(sections[k]["content"])):
                if sections[k]["content"][l][0] == "@":
                    if sections[k]["content"][l][1] != "@":
                        print("Solution in old format on "+solution)
                    else: # This block compiles the references in the solution JSON files.
                        filename = sections[k]["content"][l].split("@")[2]
                        with open("/Users/michaelgoff/Desktop/Urban Cruise Ship/Energy Model/content/"+filename) as json_file3:
                            solution_box = json.load(json_file3)
                            if "metrics" in solution_box:
                                for metric in solution_box["metrics"]:
                                    if metric not in metrics:
                                        metrics[metric] = {"total":0, "num_solutions":0}
                                    metrics[metric]["total"] += solution_box["metrics"][metric]
                                    metrics[metric]["num_solutions"] += 1
                            for mm in range(len(solution_box["text"])):
                                blocks = solution_box["text"][mm].split('[')
                                for m in range(1,len(blocks)):
                                    ref = references_master[blocks[m].split(']')[0]]
                                    if ref not in solution_data_ind["references"]:
                                        solution_data_ind["references"].append(ref)
                    solutions_count = solutions_count + 1
                    solution_box = sections[k]["content"][l].split("@")[1]
                    exclaim_lines = solution_box.split("!")
                    if len(exclaim_lines) > 1:
                        solution_box = exclaim_lines[1]
                    if sitename not in solution_counter:
                        solution_counter[sitename] = 0
                    solution_counter[sitename] += 1
                    solution_counter["total"] += 1
                    #print(solution_box)
                if sections[k]["content"][l][0] == "#":
                    with open("/Users/michaelgoff/Desktop/Urban Cruise Ship/site/Endeavors/data-out.json") as json_file3:
                        endeavors = json.load(json_file3)
                        for m in range(len(endeavors)):
                            blocks = endeavors[m]["References"].split('[')
                            for n in range(1,len(blocks)):
                                ref = references_master[blocks[n].split(']')[0]]
                                if ref not in solution_data_ind["references"]:
                                    solution_data_ind["references"].append(ref)
                
                else:
                    blocks = sections[k]["content"][l].split('[')
                    for m in range(1,len(blocks)):
                        ref = references_master[blocks[m].split(']')[0]]
                        if ref not in solution_data_ind["references"]:
                            solution_data_ind["references"].append(ref)
        with open('/Users/michaelgoff/Desktop/Urban Cruise Ship/site/solutions/'+solution+'.json', 'w') as outfile:
            json.dump(solution_data_ind, outfile)

        
# Compile each solution object in multi_solutions.json. Will eventually replace the above code snippet if retained
with open("/Users/michaelgoff/Desktop/Urban Cruise Ship/Energy Model/Model/multi_solutions.json") as json_file:
    multi_solution_data = json.load(json_file)
    for m in range(len(multi_solution_data)):
        sitename = multi_solution_data[m]["site"]
        for i in range(len(multi_solution_data[m]["topics"])):
            if ("content" in multi_solution_data[m]["topics"][i]):
                solution = multi_solution_data[m]["topics"][i]["content"]
                compile_solution(solution, multi_solution_data[m]["topics"][i], multi_solution_data[m]["topics"][i]["name"], sitename)
            for j in range(len(multi_solution_data[m]["topics"][i]["solutions"])):
                solution = multi_solution_data[m]["topics"][i]["solutions"][j]["url"]
                compile_solution(solution, multi_solution_data[m]["topics"][i],"", sitename)
    multi_solution_data.pop()
    with open('/Users/michaelgoff/Desktop/Urban Cruise Ship/site/multi_solutions.json', 'w') as outfile:
        json.dump(multi_solution_data, outfile)

print(solution_counter) # Print the number of solutions by site.
        
with open("/Users/michaelgoff/Desktop/Urban Cruise Ship/Energy Model/Model/image_list.json") as json_file:
    images = json.load(json_file)
    todo = []
    for i in range(len(images)):
        todo.append(images[i])
    with open('/Users/michaelgoff/Desktop/Urban Cruise Ship/site/todo.json', 'w') as outfile:
        json.dump(todo, outfile)
        #print("\nNumber of Solutions: "+str(solutions_count))
        
# Copy all the content objects to the site
directory = os.fsencode("/Users/michaelgoff/Desktop/Urban Cruise Ship/Energy Model/content")
for file in os.listdir(directory):
     filename = os.fsdecode(file)
     with open("/Users/michaelgoff/Desktop/Urban Cruise Ship/Energy Model/content/"+filename) as json_file:
         contents = json.load(json_file)
         with open('/Users/michaelgoff/Desktop/Urban Cruise Ship/site/content/'+filename, 'w') as outfile:
             json.dump(contents, outfile)
             
#print("")
#print(metrics)
    